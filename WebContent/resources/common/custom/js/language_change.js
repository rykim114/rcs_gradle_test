function languageChange() {
	if(lan=="KOR") {
		//헤더
		$("#lan_company").html("회사소개");
		$("#lan_company").attr("href","http://www.dawul.co.kr");
		$("#lan_address").html("주소전환");
		$("#lan_service").html("서비스 사례");
		$("#lan_app").attr("href","http://www.dawul.co.kr/service/service_sub3.jsp");
		
		$("#lan_general").html("일반");
		$("#lan_satellite").html("위성");
		
		//검색창
		$(".lan_inputSearch").attr("placeholder","Dawul 지도 검색");
		$("#lan_bInputSearch").html("검색");
		
		
		//검색 리스트 (통합검색, 길찾기 검색)
		$(".lan_etcList").html("더보기");
		$(".lan_totalTab").html("전체");
		$(".lan_addressTeb").html("주소");
		$(".lan_poiTab").html("장소");
		$(".lan_searchNull").html("다시 검색해주세요.");
		
		//지도복사 팝업
		$("#lan_copyMap").html('지도복사<span><a href="#" onclick="mapCopyPopClose();"></a></span>');
		$("#lan_copyBtn").html("복사");
		$("#lan_copyWord").html("이 지도의 주소입니다. Ctrl+C를 눌러 클립보드로 복사하세요.");
		
		//지도인쇄 팝업
		$("#lan_printBtn").html("인쇄");
		$("#lan_closeBtn").html("닫기");
		
		//길찾기 서비스 준비중
		$(".serviceErrorMsg").html("서비스 준비중 입니다.");
		
		//길찾기 검색
		$("#lan_driving").html("자동차");
		$("#lan_transit").html("대중교통");
		$("#lan_walking").html("도보");
		$("#lan_middleAdd").html("경유지 추가");
		$("#lan_initialization").html("초기화");
		$("#lan_directions").html("길찾기<span></span>");
		
		//길찾기 경로
		$("#lan_optimum").html("최적경로");
		$("#lan_distance").html("최단거리");
		$("#lan_free").html("무료도로");
		$("#lan_highway").html("고속도로");
		$("#lan_nowTraffic").html("실시간 교통정보");
		
		//길찾기 요금설정
		$("#lan_cost_Setting").html('요금설정<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("통행료 설정");
		$("#lan_price1").html("<span>1종 :</span> 승용차, 소형 승합차");
		$("#lan_price2").html("<span>2종 :</span> 중형 승합차, 중형 화물차");
		$("#lan_price3").html("<span>3종 :</span> 대형 승합차, 2축 대형 화물차");
		$("#lan_price4").html("<span>4종 :</span> 3축 대형 화물차");
		$("#lan_price5").html("<span>5종 :</span> 4축 이상 특수화물차");
		$("#lan_price6").html("<span>6종 :</span> 경차");
		$("#lan_gasChargeSetting").html("주유비 설정");
		$("#lan_oil").html("유종");
		$("#lan_oli_select").html("휘발유");
		$("#lan_gasoline").html("휘발유");
		$("#lan_ligthOil").html("경유");
		$("#lan_mileage").html("연료1L당 주행거리");
		$("#lan_costComplete").html("설정완료");
		
		//footer
		$("#lan_legend").html("지도범례 ");
		$("#lan_legalNotice").html("법적공지 ");
		$("#lan_partner").html("제휴/구매");
		$("#lan_partner").attr("href","http://www.dawul.co.kr/customer/customer_sub2.jsp");
		$("#lan_serviceCenter").html("고객센터");
	}else if(lan=="ENG") {
		//헤더
		$("#lan_company").html("Company introduction");
		$("#lan_company").attr("href","http://www.dawul.co.kr/eng/");
		$("#lan_address").html("Address conversion");
		$("#lan_service").html("Service case");
		$("#lan_app").attr("href","http://www.dawul.co.kr/eng/service/service_sub3.jsp");
		
		$("#lan_general").html("General");
		$("#lan_satellite").html("Satellite");
		
		//검색창
		$(".lan_inputSearch").attr("placeholder","Search Dawul Map");
		$("#lan_bInputSearch").html("search");
		
		//검색 리스트 (통합검색, 길찾기 검색)
		$(".lan_etcList").html("View more");
		$(".lan_totalTab").html("All");
		$(".lan_addressTeb").html("Address");
		$(".lan_poiTab").html("Place");
		$(".lan_searchNull").html("Please search again.");
		
		
		//지도복사 팝업
		$("#lan_copyMap").html('Copy map<span><a href="#" onclick="mapCopyPopClose();"></a></span>');
		$("#lan_copyBtn").html("Copy");
		$("#lan_copyWord").html("This is the address of the map. Please press Ctrl+C to copy it to the clipboard.");
		
		//지도인쇄 팝업
		$("#lan_printBtn").html("Print");
		$("#lan_closeBtn").html("Close");
		
		//길찾기 서비스 준비중
		$(".serviceErrorMsg").html("The service is being prepared.");
		
		//길찾기 검색
		$("#lan_driving").html("Driving");
		$("#lan_transit").html("Transit");
		$("#lan_walking").html("Walking");
		$("#lan_middleAdd").html("Enter stop off");
		$("#lan_initialization").html("Initialization");
		$("#lan_directions").html("Directions<span></span>");
		
		//길찾기 경로
		$("#lan_optimum").html("Best route");
		$("#lan_distance").html("Shortest distance");
		$("#lan_free").html("Aviod tolls");
		$("#lan_highway").html("Expressway");
		$("#lan_nowTraffic").html("Real-time traffic information");
		
		//길찾기 요금설정
		$("#lan_cost_Setting").html('Cost setting<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("Toll setting");
		$("#lan_price1").html("<span>1 kinds :</span> Cars, Small van");
		$("#lan_price2").html("<span>2 kinds :</span> Medium sized van, Medium truck");
		$("#lan_price3").html("<span>3 kinds :</span> Large van, 2 axle freight car");
		$("#lan_price4").html("<span>4 kinds :</span> 3 axle freight car");
		$("#lan_price5").html("<span>5 kinds :</span> Special truck over 4 axes");
		$("#lan_price6").html("<span>6 kinds :</span> Small car");
		$("#lan_gasChargeSetting").html("Gas charge setting");
		$("#lan_oil").html("Oil");
		$("#lan_oli_select").html("Gasoline");
		$("#lan_gasoline").html("Gasoline");
		$("#lan_ligthOil").html("Light oil");
		$("#lan_mileage").html("Fuel 1L mileage");
		$("#lan_costComplete").html("Completed setup");
		
		//footer
		$("#lan_legend").html("Map legend");
		$("#lan_legalNotice").html("Legal notices");
		$("#lan_partner").html("Partnership/Purchase");
		$("#lan_partner").attr("href","http://www.dawul.co.kr/eng/customer/customer_sub2.jsp");
		$("#lan_serviceCenter").html("Service center");
	}else if(lan=="JAN") {
		//헤더
		$("#lan_company").html("会社紹介");
		$("#lan_company").attr("href","http://www.dawul.co.kr/jpn/");
		$("#lan_address").html("住所転換");
		$("#lan_service").html("サービス事例");
		$("#lan_app").attr("href","http://www.dawul.co.kr/jpn/service/service_sub3.jsp");
		
		$("#lan_general").html("一般");
		$("#lan_satellite").html("衛星");
		
		
		//검색창
		$(".lan_inputSearch").attr("placeholder","Dawul 地図検索");
		$("#lan_bInputSearch").html("検索");
		
		//검색 리스트 (통합검색, 길찾기 검색)
		$(".lan_etcList").html("もっと見る");
		$(".lan_totalTab").html("全体");
		$(".lan_addressTeb").html("住所");
		$(".lan_poiTab").html("場所");
		$(".lan_searchNull").html("再び検索してください。");
		
		//지도복사 팝업
		$("#lan_copyMap").html('地図コピー<span><a href="#" onclick="mapCopyPopClose();"></a></span>');
		$("#lan_copyBtn").html("コピー");
		$("#lan_copyWord").html("この地図の住所です。Ctrl+Cを押してクリップボードにコピーしてください。");
		
		//지도인쇄 팝업
		$("#lan_printBtn").html("印刷");
		$("#lan_closeBtn").html("閉じる");
		
		//길찾기 서비스 준비중
		$(".serviceErrorMsg").html("サービスを準備しています。");
		
		//길찾기 검색
		$("#lan_driving").html("自動車");
		$("#lan_transit").html("大衆交通");
		$("#lan_walking").html("徒歩");
		$("#lan_middleAdd").html("経由地追加");
		$("#lan_initialization").html("初期化");
		$("#lan_directions").html("ルート検索<span></span>");
		
		//길찾기 경로
		$("#lan_optimum").html("最適経路");
		$("#lan_distance").html("最短距離");
		$("#lan_free").html("無料道路");
		$("#lan_highway").html("高速道路");
		$("#lan_nowTraffic").html("リアルタイム交通情報");
		
		//길찾기 요금설정
		$("#lan_cost_Setting").html('料金設定<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("通行料設定");
		$("#lan_price1").html("<span>1種 :</span> 乗用車、小型ワゴン車");
		$("#lan_price2").html("<span>2種 :</span> 中型ワゴン車、中型貨物車");
		$("#lan_price3").html("<span>3種 :</span> 大型ワゴン車、2軸の大型貨物車");
		$("#lan_price4").html("<span>4種 :</span> 3軸の大型貨物車");
		$("#lan_price5").html("<span>5種 :</span> 4軸以上特殊貨物車");
		$("#lan_price6").html("<span>6種 :</span> 軽自動車");
		$("#lan_gasChargeSetting").html("注油費設定");
		$("#lan_oil").html("有終");
		$("#lan_oli_select").html("ガソリン");
		$("#lan_gasoline").html("ガソリン");
		$("#lan_ligthOil").html("軽油");
		$("#lan_mileage").html("燃料1L当たりの走行距離");
		$("#lan_costComplete").html("設定完了");
		
		//footer
		$("#lan_legend").html("地図凡例");
		$("#lan_legalNotice").html("法的通知");
		$("#lan_partner").html("提携/購買");
		$("#lan_partner").attr("href","http://www.dawul.co.kr/jpn/customer/customer_sub2.jsp");
		$("#lan_serviceCenter").html("ヘルプ");
	}else if(lan=="CHINAG") {
		//헤더
		$("#lan_company").html("公司简介");
		$("#lan_company").attr("href","http://www.dawul.co.kr/chn/");
		$("#lan_address").html("地址转换");
		$("#lan_service").html("服务案例");
		$("#lan_app").attr("href","http://www.dawul.co.kr/chn/service/service_sub3.jsp");
		
		$("#lan_general").html("一般");
		$("#lan_satellite").html("卫星");
		
		
		//검색창
		$(".lan_inputSearch").attr("placeholder","搜索 Dawul 地图");
		$("#lan_bInputSearch").html("搜索");
		
		//검색 리스트 (통합검색, 길찾기 검색)
		$(".lan_etcList").html("查看更多");
		$(".lan_totalTab").html("全体");
		$(".lan_addressTeb").html("地址");
		$(".lan_poiTab").html("场所");
		$(".lan_searchNull").html("请重新搜索。");
		
		//지도복사 팝업
		$("#lan_copyMap").html('地图复制<span><a href="#" onclick="mapCopyPopClose();"></a></span>');
		$("#lan_copyBtn").html("复制");
		$("#lan_copyWord").html("这是这个地图的地址。请按Ctrl+C将它复制到剪贴板。");
		
		//지도인쇄 팝업
		$("#lan_printBtn").html("印刷");
		$("#lan_closeBtn").html("关闭");
		
		//길찾기 서비스 준비중
		$(".serviceErrorMsg").html("正在准备服务。");
		
		//길찾기 검색
		$("#lan_driving").html("汽车");
		$("#lan_transit").html("公交");
		$("#lan_walking").html("徒步");
		$("#lan_middleAdd").html("增加经由地");
		$("#lan_initialization").html("初始化");
		$("#lan_directions").html("查询路线<span></span>");
		
		//길찾기 경로
		$("#lan_optimum").html("最佳路线");
		$("#lan_distance").html("最短距离");
		$("#lan_free").html("免费道路");
		$("#lan_highway").html("高速公路");
		$("#lan_nowTraffic").html("实时交通信息");
		
		//길찾기 요금설정
		$("#lan_cost_Setting").html('费用设定<span><a href="#" onclick="naviPricePopupClose();"></a></span>');
		$("#lan_tollSetting").html("通行费设定");
		$("#lan_price1").html("<span>1种 :</span> 轿车、小型面包车");
		$("#lan_price2").html("<span>2种 :</span> 中型面包车、中型货车");
		$("#lan_price3").html("<span>3种 :</span> 大型面包车、2轴大型货车");
		$("#lan_price4").html("<span>4种 :</span> 3轴大型货车");
		$("#lan_price5").html("<span>5种 :</span> 4轴以上特殊货车");
		$("#lan_price6").html("<span>6种 :</span> 轻型车");
		$("#lan_gasChargeSetting").html("加油费设定");
		$("#lan_oil").html("油种");
		$("#lan_oli_select").html("汽油");
		$("#lan_gasoline").html("汽油");
		$("#lan_ligthOil").html("轻油");
		$("#lan_mileage").html("每燃料1L车程");
		$("#lan_costComplete").html("设定完了");
		
		
		//footer
		$("#lan_legend").html("地图图例");
		$("#lan_legalNotice").html("法律公告");
		$("#lan_partner").html("提携/购买");
		$("#lan_partner").attr("href","http://www.dawul.co.kr/chn/customer/customer_sub2.jsp");
		$("#lan_serviceCenter").html("用户中心");
	}
}