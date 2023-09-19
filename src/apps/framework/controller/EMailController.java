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
@RequestMapping("/email")
@SuppressWarnings("rawtypes")
public class EMailController extends CmController{

	@RequestMapping(value="/billEmailSend")
	public ModelAndView BillEmailSend(@ModelAttribute("reqMap") CmMap reqVo, HttpServletRequest request, HttpServletResponse response) {		
		ModelAndView mav = new ModelAndView("jsonView");
		
		Map<String, Object> model = new HashMap();

		String company_code = (String)reqVo.get("company_code");
		String proj_code = (String)reqVo.get("proj_code");
		String levy_ym = (String)reqVo.get("levy_ym");
		String group_seq_c = (String)reqVo.get("group_seq_c");
		String status = (String)reqVo.get("status");
		String datas = (String)reqVo.get("datas");		
		
		String fromName = "";  //보내는 사람 이름
		String fromEmail = ""; //보내는 사람 메일
		String to = "";        // 받는 사람
		String cc = "";
		String title = "";
		String[] fileName = null;
		
		String content = "";
		
		String cucode[] = datas.split("¸");
		
		
		String ajaxResult = "OK";
		String errmsg = "";
		for (int i = 0; i < cucode.length; i++) {
					
			to = "sukbeen.son@zeons.co.kr";
			title = "테스트 메일입니다";
			content = "테스트 메일입니다.. ㅎㅎㅎㅎ";
		}
		
		model.put("message", errmsg );
		mav.addObject("result", ajaxResult);
						
		return mav;
	}
	

}
