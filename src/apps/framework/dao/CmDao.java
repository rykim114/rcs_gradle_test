package apps.framework.dao;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

//@Repository
public class CmDao extends CmParentDao {
	
	
	@Resource(name="sqlSessionFactory")
    private SqlSessionFactory sqlSessionFactory;
	
	@PostConstruct
	public void Init(){
		setSqlSessionFactory(sqlSessionFactory);
	}
	
}
