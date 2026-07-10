package com.basados.api.service;

import com.resend.Resend;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${resend.from.email}")
    private String from;

    public void enviarCorreo(String destinatario, String asunto, String contenido) {
        try {
            Resend resend = new Resend(resendApiKey);
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(from)
                    .to(destinatario)
                    .subject(asunto)
                    .text(contenido)
                    .build();
            CreateEmailResponse response = resend.emails().send(params);
            log.info("Correo enviado correctamente. ID: {}", response.getId());
        } catch (Exception e) {
            log.error("Error enviando correo: {}", e.getMessage(), e);
            throw new RuntimeException("Error enviando correo", e);
        }
    }

    public void enviarCorreoConAdjunto(String destinatario, String asunto, String contenido,
                                        byte[] pdf, String nombreArchivo) {
        try {
            Resend resend = new Resend(resendApiKey);

            Attachment attachment = Attachment.builder()
                    .fileName(nombreArchivo)
                    .content(Base64.getEncoder().encodeToString(pdf))
                    .build();

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(from)
                    .to(destinatario)
                    .subject(asunto)
                    .text(contenido)
                    .attachments(attachment)
                    .build();

            CreateEmailResponse response = resend.emails().send(params);
            log.info("Correo con PDF enviado correctamente. ID: {}", response.getId());
        } catch (Exception e) {
            log.error("Error enviando correo con adjunto: {}", e.getMessage(), e);
            throw new RuntimeException("Error enviando correo con adjunto", e);
        }
    }
}