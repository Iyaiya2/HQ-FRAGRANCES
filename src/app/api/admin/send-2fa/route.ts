import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, code, channel } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Numéro de téléphone et code requis.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const message = `[HQ-FRAGRANCES] Votre code de sécurité vendeur est : ${code}. Ne le partagez avec personne.`;

    // Vérifier si des clés Twilio sont configurées dans .env.local
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromNumber) {
      // Envoi réel via l'API Twilio
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const body = new URLSearchParams();
      body.append('To', cleanPhone.startsWith('+') ? cleanPhone : `+33${cleanPhone.replace(/^0/, '')}`);
      body.append('From', fromNumber);
      body.append('Body', message);

      const twilioRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      if (!twilioRes.ok) {
        const twilioErr = await twilioRes.text();
        console.error('Twilio Error:', twilioErr);
        return NextResponse.json(
          { success: true, mode: 'direct_fallback', message: 'Code généré (Twilio non actif)' },
          { status: 200 }
        );
      }

      return NextResponse.json({
        success: true,
        mode: 'api_sent',
        channel,
        message: `Code envoyé avec succès par ${channel.toUpperCase()} au ${phone}`,
      });
    }

    // Si Twilio n'est pas encore renseigné, on renvoie le mode direct WhatsApp/SMS
    return NextResponse.json({
      success: true,
      mode: 'direct_dispatch',
      channel,
      phone: cleanPhone,
      message: 'Code 2FA généré avec succès.',
    });
  } catch (error: any) {
    console.error('2FA Send Error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du code 2FA.' },
      { status: 500 }
    );
  }
}
