package Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Document(collection = "appointments")  
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Appointment {

    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private Date date;
    private String status;

    // Getters and Setters
}
