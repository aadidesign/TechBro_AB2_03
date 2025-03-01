package Repository;

import Entity.EHR;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EHRRepository extends MongoRepository<EHR, String> {
}
