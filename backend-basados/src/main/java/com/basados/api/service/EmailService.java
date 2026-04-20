package com.basados.api.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCorreo(String destinatario, String asunto, String contenido) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(destinatario);
        message.setSubject(asunto);
        message.setText(contenido);

        mailSender.send(message);
        System.out.println("✅ Correo enviado a: " + destinatario);
    }

    public void enviarCorreoConAdjunto(String destinatario, String asunto, String contenido, byte[] pdf) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(contenido);
            helper.addAttachment("resumen_evento_basados.pdf", new ByteArrayResource(pdf));

            mailSender.send(message);
            System.out.println("📎 Correo con PDF enviado a: " + destinatario);

        } catch (Exception e) {
            throw new RuntimeException("Error enviando correo con adjunto", e);
        }
    }
}