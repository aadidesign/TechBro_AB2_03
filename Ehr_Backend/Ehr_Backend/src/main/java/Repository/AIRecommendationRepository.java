package Repository;

import Entity.AIRecommendation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AIRecommendationRepository extends MongoRepository<AIRecommendation, String> {
}
