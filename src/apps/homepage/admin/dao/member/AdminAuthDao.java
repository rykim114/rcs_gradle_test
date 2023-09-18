package apps.homepage.admin.dao.member;

import org.springframework.stereotype.Repository;

import apps.framework.dao.CmDaoExt;
import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;

@Repository
@SuppressWarnings("rawtypes")
public class AdminAuthDao extends CmDaoExt {

	public CmResMap selectAuthCompanyCode(CmMap reqVo) {
		
		logger.info("========================================");
		logger.info("========================================");
		logger.info("========================================");
		logger.info("dao");
		logger.info("========================================");
		logger.info("========================================");
		logger.info("========================================");
		return cmDao.getObject("AdminAuthDao.selectAuthCompanyCode", reqVo);
	}

	
	public int insertAuthSend(CmMap reqVo) {
		return cmDao.insert("AdminAuthDao.insertAuthSend", reqVo);
	}

	public CmResMap selectAuthSend(CmMap reqVo) {
		return cmDao.getObject("AdminAuthDao.selectAuthSend", reqVo);
	}


	public int updateAuthYN(CmMap reqVo) {
		return cmDao.update("AdminAuthDao.updateAuthYN", reqVo);
	}

	public CmResMap selectAuthUserByPhone(CmMap reqVo) {
		return cmDao.getObject("AdminAuthDao.selectAuthUserByPhone", reqVo);
	}

	public CmResMap selectRecipientByPhone(CmMap reqVo) {
		return cmDao.getObject("AdminAuthDao.selectRecipientByPhone", reqVo);
	}

	public int insertAuthUser(CmMap reqVo) {
		return cmDao.insert("AdminAuthDao.insertAuthUser", reqVo);
	}

	public CmResMap selectUserEmail(CmMap reqVo) {
		return cmDao.getObject("AdminAuthDao.selectUserEmail", reqVo);
	}
	
	public CmResMap selectNewUserId(CmMap reqVo) {
		return cmDao.getObject("AdminAuthDao.selectNewUserId", reqVo);
	}

}
