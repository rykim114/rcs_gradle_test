package apps.framework.dao;


import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Repository;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

@Repository
public class CmOracleDao extends CmParentDao {
	
	@Resource(name="sqlSessionFactory_Oracle")
    private SqlSessionFactory sqlSessionFactory;
	
	@PostConstruct
	public void Init(){
		setSqlSessionFactory(sqlSessionFactory);
	}
	
}
