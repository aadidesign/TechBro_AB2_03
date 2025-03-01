package Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "patients")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Patient {

    @Id
    private String id;
    private String name;
    private Integer age;
    private String gender;
    private String contact;
    private List<String> medicalHistory;

    // Getters and Setters
}
