package apps.homepage.admin.service.member;

import java.util.Map;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import apps.framework.object.CmMap;
import apps.framework.object.CmResMap;
import apps.framework.service.CmService;
import apps.framework.utils.CmSecretUtil;
import apps.homepage.admin.dao.member.AdminAuthDao;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class AdminAuthService extends CmService {

	protected final Log	logger = LogFactory.getLog(this.getClass());

	@Autowired
	AdminAuthDao adminAuthDao;


	
	public void updateAuthSend(CmMap reqVo, Map<String, Object> model) {
		
		// 수신자 기준으로 company_code 조회 해보고 없으면 100
		// 없으면 등록되지 않은 번호이므로 전송되지 않도록 수정
		CmResMap companyCodeObj = adminAuthDao.selectAuthCompanyCode(reqVo);
		
		if (null == companyCodeObj || StringUtils.isBlank(companyCodeObj.getString("company_code"))) {
			model.put("code", HttpStatus.NOT_FOUND.value());
			model.put("message", "등록되지 않은 연락처/이름 입니다");
			return;
		}

		reqVo.put("company_code", companyCodeObj.getString("company_code"));

		String otp = RandomStringUtils.randomNumeric(6);
		
		reqVo.put("otp_num", otp);


		adminAuthDao.insertAuthSend(reqVo);

		model.put("code", HttpStatus.OK.value());
	}



	public void updateAuthCheck(CmMap reqVo, Map<String, Object> model) {
		
		// 수신자 기준으로 company_code 조회 해보고 없으면 100
		// 없으면 등록되지 않은 번호이므로 전송되지 않도록 수정
		
		logger.info("========================================");
		logger.info("========================================");
		logger.info("========================================");
		logger.info("service");
		logger.info("========================================");
		logger.info("========================================");
		logger.info("========================================");
		CmResMap companyCodeObj = adminAuthDao.selectAuthCompanyCode(reqVo);
		
		if (null == companyCodeObj || StringUtils.isBlank(companyCodeObj.getString("company_code"))) {
			model.put("code", HttpStatus.NOT_FOUND.value());
			model.put("message", "등록되지 않은 연락처/이름 입니다");
			return;
		}

		reqVo.put("company_code", companyCodeObj.getString("company_code"));
		
		CmResMap auth = adminAuthDao.selectAuthSend(reqVo);
		
		if (null == auth) {
			model.put("code", HttpStatus.NOT_FOUND.value());
			return;
		}
		
	
		String otpNum = auth.getString("otp_num");
		
		if (! StringUtils.equals(reqVo.getString("otp_num"), otpNum)) {
			model.put("code", HttpStatus.BAD_REQUEST.value());
			return;
		}
		
		reqVo.put("seq", auth.get("seq"));
		
		adminAuthDao.updateAuthYN(reqVo);
		
		model.put("code", HttpStatus.OK.value());
	}


	public void updateAuthStart(CmMap reqVo, Map<String, Object> model) {
		/* 전화번호로 서명 가능 문서 존재여부 체크 */
		CmResMap userEmail = adminAuthDao.selectUserEmail(reqVo);
		
		if (null == userEmail) {
			model.put("code", HttpStatus.NOT_FOUND.value());
			model.put("message", "서명 가능하신 문서가 없거나, 모든 서명을 완료하셨습니다");
			return;
		}
		
		reqVo.put("user_email", userEmail.get("user_email"));
		
		/* 이름 / 전화번호로 userid 가져옴 */
		CmResMap member = adminAuthDao.selectAuthUserByPhone(reqVo);

		// 기존회원 확인
		if (null != member) {
			model.put("code", HttpStatus.OK.value());
			model.put("userId", member.get("user_id"));
			return;
		}
		
		// 회원가입
		// 전자계약 정보에서 이메일 주소 가져와야 함
		member = adminAuthDao.selectRecipientByPhone(reqVo);
		// FIXME: 고객사(리맥스) 에서 정확한 메일주소 보내준다고 가정
		// 데이터 잘못 들어온 경우 진행 불가
		if (null == member) {
			model.put("code", HttpStatus.BAD_REQUEST.value());
			return;
		}
		
		/* 신규 아이디 가져오기 'SignOn-' + 년월 8 자리 + 순번 8자리로 구성 */
		CmResMap newuserid = adminAuthDao.selectNewUserId(reqVo);
		
		// 비밀번호: 휴대폰번호로 업데이트
		reqVo.put("user_id", newuserid.get("new_user_id"));
		reqVo.put("user_password", CmSecretUtil.encodeSha256("" + member.get("user_email") + reqVo.getString("recv_num")));
		
		adminAuthDao.insertAuthUser(reqVo);
		
		model.put("code", HttpStatus.OK.value());
		model.put("userId", newuserid.get("new_user_id"));
	}
}
