package Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Document(collection = "ehr")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EHR {

    @Id
    private String id;
    private String patientId; // Use String for reference (ObjectId)
    private String doctorId;
    private Date date;
    private String diagnosis;
    private String treatment;
    private String notes;

    // Getters and Setters
}
