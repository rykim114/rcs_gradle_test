package apps.framework.controller;

import apps.framework.object.CmMap;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/sms")
@SuppressWarnings("rawtypes")
public class SmsController extends CmController{

	@RequestMapping(value="/billSmsSend")
	public ModelAndView BillSmsSend(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {		
		ModelAndView mav = new ModelAndView("jsonView");
		
		Map<String, Object> model = new HashMap();
		
		String company_code = (String)reqVo.get("company_code");
		String proj_code = (String)reqVo.get("proj_code");
		String levy_ym = (String)reqVo.get("levy_ym");
		String group_seq_c = (String)reqVo.get("group_seq_c");
		String status = (String)reqVo.get("status");
		String datas = (String)reqVo.get("datas");
		String cucode[] = datas.split("¸");

		String sendNm = "";  //보내는 사람 전화번호
		String receNm = "";  //받는 사람 전화번호
		String title = "";   // SMS/LMS 제목
		String content = ""; // SMS/LMS 내용
				
		
		String ajaxResult = "OK";
		String errmsg = "";
		for (int i = 0; i < cucode.length; i++) {
			//핸드폰 정보을 가져와야 한다...
			//sendNm = "01094423754";
			// 보내는 사람 정보는 않주면  ezREMS.properties 에서 가져온다
			
			receNm = "01094423754";
			title = "테스트 SMS입니다";
			content = "테스트 SMS입니다.. ㅎㅎㅎㅎ";

			System.out.println("==== Send SMS Start ======");
			// 일단 막음..  테스트는 완료 되었음.
			/*CmMap smsvo = cmSms.send(sendNm, receNm, title, content) ;

			if (smsvo.getString("FlagSend").equals("E") ){
				ajaxResult = "ERROR";
				errmsg += cucode[i]+"  "+smsvo.getString("Content")+"\n";

			}*/
			System.out.println("==== Send SMS End ======");
		}
		
		model.put("message", errmsg );
		mav.addObject("result", ajaxResult);
		
		return mav;
	}
	

}
