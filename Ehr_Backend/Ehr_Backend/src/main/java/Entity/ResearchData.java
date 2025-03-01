package Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Document(collection = "research_data")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResearchData {

    @Id
    private String id;
    private String title;
    private String abstractContent;
    private List<Double> embedding;

    // Getters and Setters
}
