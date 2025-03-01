package Repository;

import Entity.ResearchData;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResearchDataRepository extends MongoRepository<ResearchData, String> {
}
