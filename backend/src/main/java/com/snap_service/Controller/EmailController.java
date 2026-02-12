package com.snap_service.Controller;

import com.snap_service.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public ResponseEntity<String> sendContactEmail(@RequestBody ContactRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("nikita2003patil@gmail.com");
            message.setTo("nikita2003patil@gmail.com");
            message.setSubject("New Contact Form Message from " + request.getName());
            message.setText("Name: " + request.getName() + "\n" +
                    "Email: " + request.getEmail() + "\n\n" +
                    "Message:\n" + request.getMessage());

            mailSender.send(message);
            return ResponseEntity.ok("Message sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error sending message: " + e.getMessage());
        }
    }
}
