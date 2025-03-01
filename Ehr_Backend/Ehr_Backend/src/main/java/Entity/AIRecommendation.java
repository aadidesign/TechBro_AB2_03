package Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Document(collection = "ai_recommendations")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AIRecommendation {

    @Id
    private String id;
    private String patientId;
    private String query;
    private String recommendation;
    private List<ResearchSource> researchSources;
    private Date generatedAt;

    // Getters and Setters

    public static class ResearchSource {
        private String title;
        private String abstractContent;

        // Getters and Setters
    }
}
