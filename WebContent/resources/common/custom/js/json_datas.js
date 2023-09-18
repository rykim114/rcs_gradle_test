// 주변검색 리스트
var ncodeDatas = {
	"cate":[
		{
			"korName":"버스/지하철",
			"engName":"Bus/Subway",
			"jpnName":"バス/地下鉄",
			"chnName":"公交车/地铁",
			"depth":2,
			"code":"1605,1604",
			"image":"/resources/common/custom/images/pin/mpin_ncode_1.png",
			"subcate":[
				{
					"korName":"지하철",
					"engName":"Subway",
					"jpnName":"地下鉄",
					"chnName":"地铁",
					"code":"1604%",
					"subcode":""
				},
				{
					"korName":"버스",
					"engName":"Bus",
					"jpnName":"バス",
					"chnName":"公交车",
					"code":"1605%",
					"subcode":""
				}
			]
		},		
		{
			"korName":"카페",
			"engName":"Cafe",
			"jpnName":"カフェ",
			"chnName":"咖啡店",
			"depth":2,
			"code":"1107,1111,1112,1113",
			"image":"/resources/common/custom/images/pin/mpin_ncode_3.png",
			"subcate":[
				{
					"korName":"카페",
					"engName":"Cafe",
					"jpnName":"カフェ",
					"chnName":"咖啡店",
					"code":"1111%",
					"subcode":""
				},
				{
					"korName":"제과점",
					"engName":"Bakery",
					"jpnName":"製菓店",
					"chnName":"面包店",
					"code":"1112%",
					"subcode":""
				},
				{
					"korName":"아이스크림",
					"engName":"Ice Cream",
					"jpnName":"アイスクリーム",
					"chnName":"冰淇淋",
					"code":"1113%",
					"subcode":""
				},
				{
					"korName":"기타",
					"engName":"And Others",
					"jpnName":"その他",
					"chnName":"其它",
					"code":"1107%",
					"subcode":""
				}
			]
		},		
		{
			"korName":"병원/의료",
			"engName":"Hospital/Medical Treatment",
			"jpnName":"病院/医療",
			"chnName":"医院/医疗",
			"depth":2,
			"code":"14",
			"image":"/resources/common/custom/images/pin/mpin_ncode_5.png",
			"subcate":[
				{
					"korName":"종합병원",
					"engName":"General Hospital",
					"jpnName":"総合病院",
					"chnName":"综合医院",
					"code":"140101,140102,140115",
					"subcode":""
				},
				{
					"korName":"안과",
					"engName":"Eye Clinic",
					"jpnName":"眼科",
					"chnName":"眼科",
					"code":"140205",
					"subcode":""
				},
				{
					"korName":"피부과",
					"engName":"Dermatologic clinic",
					"jpnName":"皮膚科",
					"chnName":"皮膚科",
					"code":"140208",
					"subcode":""
				},
				{
					"korName":"정형외과",
					"engName":"Orthopedic Surgery Clinic",
					"jpnName":"整形外科",
					"chnName":"骨科",
					"code":"140214",
					"subcode":""
				},
				{
					"korName":"소아과",
					"engName":"Pediatrics Clinic",
					"jpnName":"小児科",
					"chnName":"小儿科",
					"code":"140211",
					"subcode":""
				},
				{
					"korName":"내과",
					"engName":"Internal Medicine Clinic",
					"jpnName":"内科",
					"chnName":"內科",
					"code":"140201",
					"subcode":""
				},
				{
					"korName":"이비인후과",
					"engName":"Otorhinolaryngology Clinic",
					"jpnName":"耳鼻咽喉科",
					"chnName":"耳鼻喉科",
					"code":"140215",
					"subcode":""
				},
				{
					"korName":"치과",
					"engName":"Dental Clinic",
					"jpnName":"歯科",
					"chnName":"牙科",
					"code":"140212",
					"subcode":""
				},
				{
					"korName":"산부인과",
					"engName":"Obstetrics & Gynecology Clinic",
					"jpnName":"産婦人科",
					"chnName":"妇产科",
					"code":"140213",
					"subcode":""
				},
				{
					"korName":"보건소",
					"engName":"Public Health Center",
					"jpnName":"保健所",
					"chnName":"保健所",
					"code":"1405%",
					"subcode":""
				},
				{
					"korName":"한의원",
					"engName":"Oriental Medicine Clinic",
					"jpnName":"韓医院",
					"chnName":"韩医院",
					"code":"1406%",
					"subcode":""
				},
				{
					"korName":"기타",
					"engName":"And Others",
					"jpnName":"その他",
					"chnName":"其它",
					"code":"140104,140105,140106,140107,140108,140109,140110,140111,140112,140113,140114,140116,140202,140203,140204,140206,140207,140209,140210,140216,140217,140218,140219,140220,140221,1403%,1404%",
					"subcode":""
				}
			]
		},
		
		{
			"korName":"주차장",
			"engName":"Parking Lot",
			"jpnName":"駐車場",
			"chnName":"停车场",
			"depth":2,
			"code":"",
			"image":"/resources/common/custom/images/pin/mpin_ncode_7.png",
			"subcate":[
				{
					"korName":"공영주차장",
					"engName":"Public Parking Lot",
					"jpnName":"公営駐車場",
					"chnName":"公营停车场",
					"code":"151201",
					"subcode":""
				},
				{
					"korName":"공용주차장",
					"engName":"Common Parking Garage",
					"jpnName":"共用駐車場",
					"chnName":"公用停车场",
					"code":"151213",
					"subcode":""
				},
				{
					"korName":"환승주차장",
					"engName":"Park-and-ride Lot",
					"jpnName":"乗り換え駐車場",
					"chnName":"換乘停车场",
					"code":"151202",
					"subcode":""
				}
			]
		},
		
		{
			"korName":"마트/슈퍼",
			"engName":"Mart/Supermarket",
			"jpnName":"マート/スーパー",
			"chnName":"超市",
			"depth":1,
			"code":"1302%,130601",
			"image":"/resources/common/custom/images/pin/mpin_ncode_9.png",
			"subcate":[]
		},
		
		{
			"korName":"생활/편의",
			"engName":"Life/Convenience",
			"jpnName":"生活/便利",
			"chnName":"生活/便宜",
			"depth":2,
			"code":"",
			"image":"/resources/common/custom/images/pin/mpin_ncode_11.png",
			"subcate":[
				{
					"korName":"PC방",
					"engName":"Internet Cafe",
					"jpnName":"ネットカフェ",
					"chnName":"网咖",
					"code":"132205",
					"subcode":""
				},
				{
					"korName":"찜질방",
					"engName":"Jjimjilbang",
					"jpnName":"チムジルバン",
					"chnName":"桑拿房",
					"code":"1320%",
					"subcode":""
				},
				{
					"korName":"미용실",
					"engName":"Beauty Salon",
					"jpnName":"美容室",
					"chnName":"美容室",
					"code":"1315%",
					"subcode":""
				},
				{
					"korName":"노래방",
					"engName":"Karaoke Room",
					"jpnName":"カラオケ",
					"chnName":"卡拉OK",
					"code":"1204%",
					"subcode":""
				},
				{
					"korName":"독서실",
					"engName":"Reading Room",
					"jpnName":"読書室",
					"chnName":"读书室",
					"code":"051416",
					"subcode":""
				},
				{
					"korName":"세탁소",
					"engName":"Laundry",
					"jpnName":"洗濯所",
					"chnName":"洗衣店",
					"code":"1328%",
					"subcode":""
				},
				{
					"korName":"열쇠/도장",
					"engName":"Key/Stamp",
					"jpnName":"鍵/印",
					"chnName":"钥匙/印",
					"code":"132926",
					"subcode":""
				},
				{
					"korName":"꽃집/화원",
					"engName":"Flower Shop / Garden",
					"jpnName":"花屋/花園",
					"chnName":"鲜花店/花园",
					"code":"132907",
					"subcode":""
				}
			]
		},
		
		{
			"korName":"스포츠시설",
			"engName":"Sport Facility",
			"jpnName":"スポーツ施設",
			"chnName":"体育设施",
			"depth":1,
			"code":"0407%,0414%,0415%,0416%,0417%,0418%,0419%,0420%,0422%,0423%",
			"image":"/resources/common/custom/images/pin/mpin_ncode_13.png",
			"subcate":[]
		}
	]
};


//주변검색 리스트
var ncodeDatas2 = {
	"cate":[		
		{
			"korName":"음식점",
			"engName":"Restaurant",
			"jpnName":"いんしょくてん",
			"chnName":"餐馆",
			"depth":2,
			"code":"11",
			"image":"/resources/common/custom/images/pin/mpin_ncode_2.png",
			"subcate":[
				{
					"korName":"한식",
					"engName":"Korean Food",
					"jpnName":"韓国料理",
					"chnName":"韩食",
					"code":"1101%",
					"subcode":""
				},
				{
					"korName":"일식",
					"engName":"Japanese Food",
					"jpnName":"日食",
					"chnName":"日食",
					"code":"1104%",
					"subcode":""
				},
				{
					"korName":"중식",
					"engName":"Chinese Food",
					"jpnName":"中華料理",
					"chnName":"中食",
					"code":"1102%",
					"subcode":""
				},
				{
					"korName":"서양음식",
					"engName":"Western Food",
					"jpnName":"西洋料理",
					"chnName":"西式饮食",
					"code":"1103%",
					"subcode":""
				},
				{
					"korName":"패밀리레스토랑",
					"engName":"Family Restaurant",
					"jpnName":"ファミリーレストラン",
					"chnName":"家庭餐馆",
					"code":"1109%",
					"subcode":""
				},
				{
					"korName":"분식",
					"engName":"Bunsik",
					"jpnName":"粉食",
					"chnName":"面食",
					"code":"1106%",
					"subcode":""
				},
				{
					"korName":"패스트푸드",
					"engName":"Fast Food",
					"jpnName":"ファーストフード",
					"chnName":"快餐食品",
					"code":"1110%",
					"subcode":""
				},
				{
					"korName":"피자",
					"engName":"Pizza",
					"jpnName":"ピザ",
					"chnName":"比萨饼",
					"code":"1108%",
					"subcode":""
				},
				{
					"korName":"치킨",
					"engName":"Chicken",
					"jpnName":"チキン",
					"chnName":"炸鸡",
					"code":"1114%",
					"subcode":""
				},
				{
					"korName":"주점",
					"engName":"Bar",
					"jpnName":"飲み屋",
					"chnName":"酒店",
					"code":"12%",
					"subcode":""
				},
				{
					"korName":"기타",
					"engName":"And Others",
					"jpnName":"その他",
					"chnName":"其它",
					"code":"1105%",
					"subcode":""
				}
			]
		},		
		{
			"korName":"숙박",
			"engName":"Accommodation",
			"jpnName":"宿泊",
			"chnName":"住宿",
			"depth":2,
			"code":"09",
			"image":"/resources/common/custom/images/pin/mpin_ncode_4.png",
			"subcate":[
				{
					"korName":"호텔",
					"engName":"Hotel",
					"jpnName":"ホテル",
					"chnName":"饭店",
					"code":"0901%",
					"subcode":""
				},
				{
					"korName":"펜션,민박",
					"engName":"Pension/Private Rental Room Service",
					"jpnName":"ペンション/民宿",
					"chnName":"山庄/民宿",
					"code":"0905%,0907%",
					"subcode":""
				},
				{
					"korName":"리조트,콘도",
					"engName":"Resort/Condo",
					"jpnName":"リゾート/コンドミニアム",
					"chnName":"度假村/公寓",
					"code":"0902%",
					"subcode":""
				},
				{
					"korName":"게스트하우스",
					"engName":"Guest House",
					"jpnName":"ゲストハウス",
					"chnName":"背包客栈",
					"code":"0910%",
					"subcode":""
				},
				{
					"korName":"캠핑장",
					"engName":"Camping Area",
					"jpnName":"キャンプ場",
					"chnName":"露营地",
					"code":"0409%",
					"subcode":""
				},
				{
					"korName":"모텔",
					"engName":"Motel",
					"jpnName":"モーテル",
					"chnName":"汽车旅馆",
					"code":"090600,090601",
					"subcode":""
				},
				{
					"korName":"여관",
					"engName":"Inn",
					"jpnName":"旅館",
					"chnName":"旅馆",
					"code":"090602",
					"subcode":""
				},
				{
					"korName":"유스호스텔",
					"engName":"Youth Hostel",
					"jpnName":"ユースホステル",
					"chnName":"青年旅社",
					"code":"0904%",
					"subcode":""
				},
				{
					"korName":"레지던스",
					"engName":"Residence",
					"jpnName":"レジデンス",
					"chnName":"酒店式公寓",
					"code":"0903%",
					"subcode":""
				},
				{
					"korName":"기타",
					"engName":"And Others",
					"jpnName":"その他",
					"chnName":"其它",
					"code":"0908%,0909%",
					"subcode":""
				}
			]
		},
		
		{
			"korName":"은행",
			"engName":"Bank",
			"jpnName":"銀行",
			"chnName":"银行",
			"depth":2,
			"code":"",
			"image":"/resources/common/custom/images/pin/mpin_ncode_6.png",
			"subcate":[
				{
					"korName":"ATM",
					"engName":"ATM",
					"jpnName":"ATM",
					"chnName":"ATM",
					"code":"0707%",
					"subcode":""
				},
				{
					"korName":"KB국민은행",
					"engName":"KB Kookmin Bank",
					"jpnName":"KB国民銀行",
					"chnName":"KB国民银行",
					"code":"070102",
					"subcode":""
				},
				{
					"korName":"우리은행",
					"engName":"Woori Bank",
					"jpnName":"ウリィ銀行",
					"chnName":"友利银行",
					"code":"070103",
					"subcode":""
				},
				{
					"korName":"신한은행",
					"engName":"Shinhan Bank",
					"jpnName":"新韓銀行",
					"chnName":"新韩银行",
					"code":"070105",
					"subcode":""
				},
				{
					"korName":"농협",
					"engName":"Nonghyup",
					"jpnName":"農協",
					"chnName":"农协",
					"code":"070201",
					"subcode":""
				},
				{
					"korName":"IBK기업은행",
					"engName":"IBK Industrial Bank",
					"jpnName":"IBK企業銀行",
					"chnName":"IBK企业银行",
					"code":"070109",
					"subcode":""
				},
				{
					"korName":"KEB하나은행",
					"engName":"Keb Hana Bank",
					"jpnName":"KEBハナ銀行",
					"chnName":"KEB韩亚银行",
					"code":"070121",
					"subcode":""
				},
				{
					"korName":"SC제일은행",
					"engName":"Standard Chartered Bank",
					"jpnName":"スタンダードチャータード銀行",
					"chnName":"SC渣打银行",
					"code":"070104",
					"subcode":""
				},
				{
					"korName":"한국씨티은행",
					"engName":"Citi Bank Korea",
					"jpnName":"韓国シティ銀行",
					"chnName":"韩国CITY銀行",
					"code":"070107",
					"subcode":""
				},
				{
					"korName":"KDB산업은행",
					"engName":"KDB Bank",
					"jpnName":"KDB産業銀行",
					"chnName":"KDB产业银行",
					"code":"070111",
					"subcode":""
				},
				{
					"korName":"대구은행",
					"engName":"Daegu Bank",
					"jpnName":"テグ銀行",
					"chnName":"大邱银行",
					"code":"070113",
					"subcode":""
				},
				{
					"korName":"부산은행",
					"engName":"Busan Bank",
					"jpnName":"プサン銀行",
					"chnName":"釜山银行",
					"code":"070114",
					"subcode":""
				},
				{
					"korName":"광주은행",
					"engName":"Kwangju Bank",
					"jpnName":"クァンジュ銀行",
					"chnName":"光州银行",
					"code":"070112",
					"subcode":""
				},
				{
					"korName":"경남은행",
					"engName":"Gyeongnam Bank",
					"jpnName":"キョンナム銀行",
					"chnName":"庆南銀行",
					"code":"070116",
					"subcode":""
				},
				{
					"korName":"전북은행",
					"engName":"Jeonbuk Bank",
					"jpnName":"チョンブク銀行",
					"chnName":"全北银行",
					"code":"070117",
					"subcode":""
				},
				{
					"korName":"제주은행",
					"engName":"Cheju Bank",
					"jpnName":"チェジュ銀行",
					"chnName":"济州银行",
					"code":"070115",
					"subcode":""
				},
				{
					"korName":"새마을금고",
					"engName":"Saemaeul Bank",
					"jpnName":"セマウル金庫",
					"chnName":"新社区信用合作社",
					"code":"070120",
					"subcode":""
				},
				{
					"korName":"신협",
					"engName":"Credit Union",
					"jpnName":"信協",
					"chnName":"信协",
					"code":"070204",
					"subcode":""
				},
				{
					"korName":"수협",
					"engName":"Suhyup",
					"jpnName":"水協",
					"chnName":"水协",
					"code":"070202",
					"subcode":""
				},
				{
					"korName":"상호저축은행",
					"engName":"Federation of Savings Bank",
					"jpnName":"相互貯蓄銀行",
					"chnName":"相互贮畜银行",
					"code":"070119",
					"subcode":""
				},
				{
					"korName":"기타",
					"engName":"And Others",
					"jpnName":"その他",
					"chnName":"其它",
					"code":"070118,070203",
					"subcode":""
				}
			]
		},
		
		{
			"korName":"주유소",
			"engName":"Gas Station",
			"jpnName":"ガソリンスタンド",
			"chnName":"加油站",
			"depth":2,
			"code":"",
			"image":"/resources/common/custom/images/pin/mpin_ncode_8.png",
			"subcate":[
				{
					"korName":"GS주유소",
					"engName":"GS Gas Station",
					"jpnName":"GSガソリンスタンド",
					"chnName":"GS加油站",
					"code":"151303,151311",
					"subcode":""
				},
				{
					"korName":"SK주유소",
					"engName":"SK Gas Station",
					"jpnName":"SKガソリンスタンド",
					"chnName":"SK加油站",
					"code":"151301,151302,151309,151310",
					"subcode":""
				},
				{
					"korName":"에스오일주유소",
					"engName":"S-OIL Gas Station",
					"jpnName":"S-OILガソリンスタンド",
					"chnName":"S-Oil加油站",
					"code":"151305,151313",
					"subcode":""
				},
				{
					"korName":"현대오일뱅크주유소",
					"engName":"Hyundai Oilbank Gas Station",
					"jpnName":"現代オイルバンクガソリンスタンド",
					"chnName":"现代oilbank加油站",
					"code":"151304,151312",
					"subcode":""
				},
				{
					"korName":"E1충전소",
					"engName":"E1 LPG Station",
					"jpnName":"E1充電所",
					"chnName":"E1充电站",
					"code":"151405",
					"subcode":""
				},
				{
					"korName":"SK충전소",
					"engName":"SK LPG Station",
					"jpnName":"SK充電所",
					"chnName":"SK充电站",
					"code":"151402",
					"subcode":""
				},
				{
					"korName":"GS충전소",
					"engName":"GS LPG Station",
					"jpnName":"GS充電所",
					"chnName":"GS充电站",
					"code":"151401",
					"subcode":""
				},
				{
					"korName":"에스오일충전소",
					"engName":"S-OIL LPG Station",
					"jpnName":"エスオイル充電所",
					"chnName":"S-Oil充电站",
					"code":"151404",
					"subcode":""
				},
				{
					"korName":"현대오일뱅크충전소",
					"engName":"Hyundai LPG Station",
					"jpnName":"現代オイルバンク充電所",
					"chnName":"现代oilbank充电站",
					"code":"151403",
					"subcode":""
				},
				{
					"korName":"기타 주유소",
					"engName":"Other Gas Station",
					"jpnName":"その他ガソリンスタンド",
					"chnName":"其他加油站",
					"code":"151306,151307,151601",
					"subcode":""
				}
			]
		},
		
		{
			"korName":"편의점",
			"engName":"Convenience Store",
			"jpnName":"コンビニ",
			"chnName":"便利店",
			"depth":1,
			"code":"1305%",
			"image":"/resources/common/custom/images/pin/mpin_ncode_10.png",
			"subcate":[]
		},
		
		{
			"korName":"영화/공연",
			"engName":"Movie/Performance",
			"jpnName":"映画/公演",
			"chnName":"电影/公演",
			"depth":1,
			"code":"0804%,0805%",
			"image":"/resources/common/custom/images/pin/mpin_ncode_12.png",
			"subcate":[]
		},
		
		{
			"korName":"관공서",
			"engName":"Public Office",
			"jpnName":"官公署",
			"chnName":"公署",
			"depth":2,
			"code":"02%",
			"image":"/resources/common/custom/images/pin/mpin_ncode_14.png",
			"subcate":[
				{
					"korName":"국회",
					"engName":"국회",
					"jpnName":"국회",
					"chnName":"국회",
					"code":"0201%",
					"subcode":""
				},
				{
					"korName":"주요정부부처",
					"engName":"주요정부부처",
					"jpnName":"주요정부부처",
					"chnName":"주요정부부처",
					"code":"0202%",
					"subcode":""
				},
				{
					"korName":"정부청사",
					"engName":"정부청사",
					"jpnName":"정부청사",
					"chnName":"정부청사",
					"code":"0203%",
					"subcode":""
				},
				{
					"korName":"특별시청",
					"engName":"특별시청",
					"jpnName":"특별시청",
					"chnName":"특별시청",
					"code":"0204%",
					"subcode":""
				},
				{
					"korName":"광역시청",
					"engName":"광역시청",
					"jpnName":"광역시청",
					"chnName":"광역시청",
					"code":"0205%",
					"subcode":""
				},
				{
					"korName":"도청",
					"engName":"도청",
					"jpnName":"도청",
					"chnName":"도청",
					"code":"0206%",
					"subcode":""
				},
				{
					"korName":"일반시청",
					"engName":"일반시청",
					"jpnName":"일반시청",
					"chnName":"일반시청",
					"code":"0207%",
					"subcode":""
				},
				{
					"korName":"군청",
					"engName":"군청",
					"jpnName":"군청",
					"chnName":"군청",
					"code":"0208%",
					"subcode":""
				},
				{
					"korName":"구청",
					"engName":"구청",
					"jpnName":"구청",
					"chnName":"구청",
					"code":"0209%",
					"subcode":""
				},
				{
					"korName":"주민센터",
					"engName":"주민센터",
					"jpnName":"주민센터",
					"chnName":"주민센터",
					"code":"0210%",
					"subcode":""
				},
				{
					"korName":"읍사무소",
					"engName":"읍사무소",
					"jpnName":"읍사무소",
					"chnName":"읍사무소",
					"code":"0211%",
					"subcode":""
				},
				{
					"korName":"면사무소",
					"engName":"면사무소",
					"jpnName":"면사무소",
					"chnName":"면사무소",
					"code":"0212%",
					"subcode":""
				},
				{
					"korName":"리사무소",
					"engName":"리사무소",
					"jpnName":"리사무소",
					"chnName":"리사무소",
					"code":"0213%",
					"subcode":""
				},
				{
					"korName":"의회",
					"engName":"의회",
					"jpnName":"의회",
					"chnName":"의회",
					"code":"0214%",
					"subcode":""
				},
				{
					"korName":"우정사업본부",
					"engName":"우정사업본부",
					"jpnName":"우정사업본부",
					"chnName":"우정사업본부",
					"code":"0215%",
					"subcode":""
				},
				{
					"korName":"기상/관측",
					"engName":"기상/관측",
					"jpnName":"기상/관측",
					"chnName":"기상/관측",
					"code":"0216%",
					"subcode":""
				},
				{
					"korName":"외국공관",
					"engName":"외국공관",
					"jpnName":"외국공관",
					"chnName":"외국공관",
					"code":"0217%",
					"subcode":""
				},
				{
					"korName":"세무기관",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0218%",
					"subcode":""
				},
				{
					"korName":"민원봉사실",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0220%",
					"subcode":""
				},
				{
					"korName":"문화원",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0221%",
					"subcode":""
				},
				{
					"korName":"선거관리위원회",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0222%",
					"subcode":""
				},
				{
					"korName":"노동사무소",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0223%",
					"subcode":""
				},
				{
					"korName":"고용안정센터",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0224%",
					"subcode":""
				},
				{
					"korName":"공공단체",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0225%",
					"subcode":""
				},
				{
					"korName":"사설단체",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0226%",
					"subcode":""
				},
				{
					"korName":"국립연구소/연구센터",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"022700",
					"subcode":""
				},
				{
					"korName":"사설연구소/연구센터",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"022701",
					"subcode":""
				},
				{
					"korName":"농업시설",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0228%",
					"subcode":""
				},
				{
					"korName":"회관",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0229%",
					"subcode":""
				},
				{
					"korName":"사회복지시설",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0230%",
					"subcode":""
				},
				{
					"korName":"전화국",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0231%",
					"subcode":""
				},
				{
					"korName":"정부투자기관",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"023200,023205,023206,023208,023209,023210,023216,023217,023218,023227,023228,023232,023237,023238,023239,023245,023246,023247,023248,023249,023250,023251,023252,023253,023255",
					"subcode":""
				},
				{
					"korName":"공기업",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"023201,023202,023203,023204,023207,023213,023214,023215,023219,023221,023222,023223,023224,023225,023226,023229,023230,023231,023233,023234,023235,023236,023240,023241,023242,023243,023244,023254",
					"subcode":""
				},
				{
					"korName":"교육청",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0233%",
					"subcode":""
				},
				{
					"korName":"병무청",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0234%",
					"subcode":""
				},
				{
					"korName":"행정복합시설",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0236%",
					"subcode":""
				},
				{
					"korName":"행정복지센터",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0237%",
					"subcode":""
				},
				{
					"korName":"기타행정",
					"engName":"",
					"jpnName":"",
					"chnName":"",
					"code":"0235%",
					"subcode":""
				}
			]
		}
	]
};


//자동차 안내정보
var carRouteInfos = {
	"body":{
		"constant":[
			{
				"desc":"facilityType",
				"code":[
					{
						"korDesc":"고가도로",
						"engDesc":"Overpass",
						"jpnDesc":"高架道路",
						"chnDesc":"高架道路",
						"code":"3"
					},
					{
						"korDesc":"터널",
						"engDesc":"Tunnel",
						"jpnDesc":"トンネル",
						"chnDesc":"隧道",
						"code":"2"
					},
					{
						"korDesc":"교량",
						"engDesc":"Bridge",
						"jpnDesc":"橋梁",
						"chnDesc":"橋梁",
						"code":"1"
					},
					{
						"korDesc":"일반도로",
						"engDesc":"General Road",
						"jpnDesc":"一般道路",
						"chnDesc":"一般道路",
						"code":"0"
					},
					{
						"korDesc":"지하도로",
						"engDesc":"Underground Road",
						"jpnDesc":"地下道路",
						"chnDesc":"地下道路",
						"code":"4"
					}
				]
			},
			{
				"desc":"roadType",
				"code":[
					{
						"korDesc":"보행자 전용",
						"engDesc":"Pedestrian Precinct",
						"jpnDesc":"歩行者専用",
						"chnDesc":"步行者专用",
						"code":"22"
					},
					{
						"korDesc":"시장길",
						"engDesc":"Market Road",
						"jpnDesc":"シジャンギル",
						"chnDesc":"市场路",
						"code":"23"
					},
					{
						"korDesc":"세도로",
						"engDesc":"Narrow Road",
						"jpnDesc":"狭い道路",
						"chnDesc":"狭窄道路",
						"code":"11"
					},
					{
						"korDesc":"페리항로",
						"engDesc":"Ferry Sea Lane",
						"jpnDesc":"フェリー航路",
						"chnDesc":"渡轮航线",
						"code":"12"
					},
					{
						"korDesc":"자전거 전용",
						"engDesc":"Bicycle Only",
						"jpnDesc":"自転車専用",
						"chnDesc":"自行车专用",
						"code":"21"
					},
					{
						"korDesc":"국도",
						"engDesc":"National Highway",
						"jpnDesc":"国道",
						"chnDesc":"国道",
						"code":"3"
					},
					{
						"korDesc":"도시고속도로",
						"engDesc":"Urban Expressway",
						"jpnDesc":"都市高速道路",
						"chnDesc":"城市高速公路",
						"code":"2"
					},
					{
						"korDesc":"고속도로",
						"engDesc":"Highway",
						"jpnDesc":"高速道路",
						"chnDesc":"高速公路",
						"code":"1"
					},
					{
						"korDesc":"기타도로2 (중앙선 없음)",
						"engDesc":"Other Roads2 (No Centralline)",
						"jpnDesc":"その他道路2 (中央線なし)",
						"chnDesc":"其他道路2 (无中央线)",
						"code":"10"
					},
					{
						"korDesc":"미지정",
						"engDesc":"Undesignated",
						"jpnDesc":"未定",
						"chnDesc":"未定",
						"code":"0"
					},
					{
						"korDesc":"주요도로2 (4~5차선)",
						"engDesc":"Main Road (A Four/Five Lanes)",
						"jpnDesc":"主要道路2 (4~5車線)",
						"chnDesc":"主路2 (4~5车线)",
						"code":"7"
					},
					{
						"korDesc":"주요도로2 (6차선이상)",
						"engDesc":"Main Road (Over Six Lanes)",
						"jpnDesc":"主要道路1 (6車線以上)",
						"chnDesc":"主路1 (6车线以上)",
						"code":"6"
					},
					{
						"korDesc":"지방도",
						"engDesc":"Local Road",
						"jpnDesc":"地方道",
						"chnDesc":"地方道",
						"code":"5"
					},
					{
						"korDesc":"국가지원 지방도",
						"engDesc":"",
						"jpnDesc":"国家支援地方道",
						"chnDesc":"国家支援地方道",
						"code":"4"
					},
					{
						"korDesc":"기타도로1 (중앙선존재)",
						"engDesc":"Other Roads1 (Centerline Existence)",
						"jpnDesc":"その他道路1 (中央線存在)",
						"chnDesc":"其他道路1 (有中央线)",
						"code":"9"
					},
					{
						"korDesc":"주요도로3 (4차선 미만)",
						"engDesc":"Main Road (Less Than Four Lanes)",
						"jpnDesc":"主要道路3 (4車線未満)",
						"chnDesc":"主路3 (4车线未满)",
						"code":"8"
					}
					
				]
			},
			{
				"desc":"linkType",
				"code":[
					{
						"korDesc":"자동차전용도로",
						"engDesc":"Motorway/Expressway",
						"jpnDesc":"自動車専用道路",
						"chnDesc":"汽车专用道路",
						"code":"22"
					},
					{
						"korDesc":"버스차로",
						"engDesc":"Bus Only Lane",
						"jpnDesc":"バス車道",
						"chnDesc":"公交车路",
						"code":"23"
					},
					{
						"korDesc":"단지내 도로",
						"engDesc":"Road Of Park",
						"jpnDesc":"団地内の道路",
						"chnDesc":"园区內道路",
						"code":"13"
					},
					{
						"korDesc":"U턴",
						"engDesc":"U-Turn",
						"jpnDesc":"ユーターン",
						"chnDesc":"掉头",
						"code":"11"
					},
					{
						"korDesc":"진출입로",
						"engDesc":"Slip Road",
						"jpnDesc":"階段",
						"chnDesc":"进出入路",
						"code":"12"
					},
					{
						"korDesc":"교차로",
						"engDesc":"Crossroad",
						"jpnDesc":"交差点",
						"chnDesc":"交叉路",
						"code":"3"
					},
					{
						"korDesc":"유료도로",
						"engDesc":"Toll Road",
						"jpnDesc":"有料道路",
						"chnDesc":"收费公路",
						"code":"21"
					},
					{
						"korDesc":"JC",
						"engDesc":"JC",
						"jpnDesc":"JC",
						"chnDesc":"JC",
						"code":"2"
					},
					{
						"korDesc":"본선분리",
						"engDesc":"Line Separation",
						"jpnDesc":"本線分離",
						"chnDesc":"本线分离",
						"code":"1"
					},
					{
						"korDesc":"P-Turn",
						"engDesc":"P-Turn",
						"jpnDesc":"P-Turn",
						"chnDesc":"P-Turn",
						"code":"10"
					},
					{
						"korDesc":"로타리",
						"engDesc":"Rotary",
						"jpnDesc":"ロータリー",
						"chnDesc":"环岛",
						"code":"7"
					},
					{
						"korDesc":"휴게소",
						"engDesc":"Rest Area",
						"jpnDesc":"休憩所",
						"chnDesc":"服务区",
						"code":"5"
					},
					{
						"korDesc":"IC",
						"engDesc":"IC",
						"jpnDesc":"IC",
						"chnDesc":"IC",
						"code":"4"
					},
					{
						"korDesc":"회차로",
						"engDesc":"Return Road",
						"jpnDesc":"回送路",
						"chnDesc":"回车路",
						"code":"9"
					},
					{
						"korDesc":"교통섬",
						"engDesc":"Traffic Island",
						"jpnDesc":"交通島",
						"chnDesc":"交通岛",
						"code":"8"
					}
				]
			},
			{
				"desc":"guideType",
				"code":[
					{
						"korDesc":"터널 출현",
						"engDesc":"Tunnel Appeared",
						"jpnDesc":"トンネルの出現",
						"chnDesc":"隧道出现",
						"code":"78"
					},
					{
						"korDesc":"로타리 12시방향",
						"engDesc":"Rotary Turn At 12 O'Clock",
						"jpnDesc":"ロータリー12時方向",
						"chnDesc":"环岛12时方向",
						"code":"112"
					},
					{
						"korDesc":"로타리 10시방향",
						"engDesc":"Rotary Turn At 10 O'Clock",
						"jpnDesc":"ロータリー10時方向",
						"chnDesc":"环岛10时方向",
						"code":"110"
					},
					{
						"korDesc":"로타리 11시방향",
						"engDesc":"Rotary Turn At 11 O'Clock",
						"jpnDesc":"ロータリー11時方向",
						"chnDesc":"环岛11时方向",
						"code":"111"
					},
					{
						"korDesc":"고속도로 톨게이트 출현",
						"engDesc":"Toll Gate Appeared On Highway",
						"jpnDesc":"高速道路トールゲートの出現",
						"chnDesc":"高速公路收费站出现",
						"code":"33"
					},
					{
						"korDesc":"직진해서 우회전",
						"engDesc":"Go Straight And Turn Right",
						"jpnDesc":"直進して右折",
						"chnDesc":"直行后右转",
						"code":"39"
					},
					{
						"korDesc":"직진해서 왼쪽",
						"engDesc":"Go Straight And Left",
						"jpnDesc":"直進して左",
						"chnDesc":"直行后左边",
						"code":"37"
					},
					{
						"korDesc":"직진해서 오른쪽",
						"engDesc":"Go Straight And Right",
						"jpnDesc":"直進して右側",
						"chnDesc":"直行后右边",
						"code":"38"
					},
					{
						"korDesc":"오르쪽으로진입해서유턴",
						"engDesc":"Leading To The Right And Take U-Turn",
						"jpnDesc":"右に進入し、ユーターン",
						"chnDesc":"右边进入掉头",
						"code":"43"
					},
					{
						"korDesc":"좌회전해서 오른쪽",
						"engDesc":"Take A Left And Right",
						"jpnDesc":"左折して右",
						"chnDesc":"左转后右边",
						"code":"40"
					},
					{
						"korDesc":"재탐색 시작",
						"engDesc":"Start Research",
						"jpnDesc":"再び探索開始",
						"chnDesc":"重新探索开始",
						"code":"67"
					},
					{
						"korDesc":"가상 주행 끝",
						"engDesc":"Simulation Navigation End",
						"jpnDesc":"仮想走行終了",
						"chnDesc":"模拟导航结束",
						"code":"66"
					},
					{
						"korDesc":"휴게소도착하여 재탐색 시작",
						"engDesc":"Arrived At Rest Area And Start Research",
						"jpnDesc":"休憩所到着して再び探索開始",
						"chnDesc":"到达服务区并重新开始搜索",
						"code":"69"
					},
					{
						"korDesc":"실제주행 안내 끝",
						"engDesc":"Navigation End",
						"jpnDesc":"実際の走行案内終了",
						"chnDesc":"导航结束",
						"code":"68"
					},
					{
						"korDesc":"직진방향 지하도로진입",
						"engDesc":"Entering Straight Underground Road",
						"jpnDesc":"直進方向の地下道路の進入",
						"chnDesc":"直行方向地下道路进入",
						"code":"22"
					},
					{
						"korDesc":"오른쪽 지하도로진입",
						"engDesc":"Entering Right Underground Road",
						"jpnDesc":"右地下道路の進入",
						"chnDesc":"进入右边地下道路",
						"code":"23"
					},
					{
						"korDesc":"가운데 고가도로진입",
						"engDesc":"Entry Into The Overpass",
						"jpnDesc":"中央高架道路の進入",
						"chnDesc":"进入中间的高架道路",
						"code":"24"
					},
					{
						"korDesc":"오른쪽 지하도로옆길",
						"engDesc":"Right Side Road Of Underground Road",
						"jpnDesc":"右地下道の沿道",
						"chnDesc":"右边地下道路旁路",
						"code":"25"
					},
					{
						"korDesc":"계속직진",
						"engDesc":"Go Straight",
						"jpnDesc":"継続直進",
						"chnDesc":"继续直行",
						"code":"26"
					},
					{
						"korDesc":"도시고속 직진",
						"engDesc":"Urban Expressway Go Straight",
						"jpnDesc":"都市高速直進",
						"chnDesc":"城市高速直行",
						"code":"27"
					},
					{
						"korDesc":"고속도로 직진",
						"engDesc":"Highway Go Straight",
						"jpnDesc":"高速道路直進",
						"chnDesc":"高速道路直行",
						"code":"28"
					},
					{
						"korDesc":"고속도로 인터체인지 출현",
						"engDesc":"Highway IC Appearance",
						"jpnDesc":"高速道路インターチェンジの出現",
						"chnDesc":"高速公路立交桥出现",
						"code":"29"
					},
					{
						"korDesc":"우회전",
						"engDesc":"Turn Right",
						"jpnDesc":"右折",
						"chnDesc":"右转",
						"code":"3"
					},
					{
						"korDesc":"좌회전",
						"engDesc":"Turn Left",
						"jpnDesc":"左折",
						"chnDesc":"左转",
						"code":"2"
					},
					{
						"korDesc":"직진",
						"engDesc":"Go Straight",
						"jpnDesc":"直進",
						"chnDesc":"直行",
						"code":"1"
					},
					{
						"korDesc":"안내없음",
						"engDesc":"No Guide",
						"jpnDesc":"案内なし",
						"chnDesc":"无指南",
						"code":"0"
					},
					{
						"korDesc":"10시방향", 
						"engDesc":"10 O'Clock Direction",
						"jpnDesc":"10時方向",
						"chnDesc":"10时方向",
						"code":"7"
					},
					{
						"korDesc":"고속도로 분기점 출현", 
						"engDesc":"Highway JC Appearance",
						"jpnDesc":"高速道路分岐点の出現",
						"chnDesc":"高速公路分岔点出现",
						"code":"30"
					},
					{
						"korDesc":"8시방향", 
						"engDesc":"8 O'Clock Direction",
						"jpnDesc":"8時方向",
						"chnDesc":"8时方向",
						"code":"6"
					},
					{
						"korDesc":"7시방향", 
						"engDesc":"7 O'Clock Direction",
						"jpnDesc":"7時方向",
						"chnDesc":"7时方向",
						"code":"5"
					},
					{
						"korDesc":"고속도로 터널 출현", 
						"engDesc":"Tunnel Appeared On Highway",
						"jpnDesc":"高速道路トンネルの出現",
						"chnDesc":"高速公路隧道出现",
						"code":"32"
					},
					{
						"korDesc":"U턴", 
						"engDesc":"U-Turn",
						"jpnDesc":"ユーターン",
						"chnDesc":"掉头",
						"code":"4"
					},
					{
						"korDesc":"고속도로 휴게소 출현", 
						"engDesc":"Rest Area Appeared On Highway",
						"jpnDesc":"高速道路休憩所の出現",
						"chnDesc":"高速公路服务区出现",
						"code":"31"
					},
					{
						"korDesc":"링크없는곳으로 경로이탈", 
						"engDesc":"Going Off Course To Out Of Link Area",
						"jpnDesc":"リンクのないところで経路離脱",
						"chnDesc":"脱离没有链接的地方",
						"code":"70"
					},
					{
						"korDesc":"1시방향", 
						"engDesc":"1 O'Clock Direction",
						"jpnDesc":"1時方向",
						"chnDesc":"1时方向",
						"code":"9"
					},
					{
						"korDesc":"11시방향", 
						"engDesc":"11 O'Clock Direction",
						"jpnDesc":"11時方向",
						"chnDesc":"11时方向",
						"code":"8"
					},
					{
						"korDesc":"오른쪽 고가도로진입", 
						"engDesc":"Entering Right Overpass",
						"jpnDesc":"右高架道路の進入",
						"chnDesc":"进入右边高架路",
						"code":"19"
					},
					{
						"korDesc":"세도로좌회전", 
						"engDesc":"Narrow Road Left Turn",
						"jpnDesc":"狭い道路に左折",
						"chnDesc":"狭窄道路左转",
						"code":"55"
					},
					{
						"korDesc":"직진방향 고가도로진입", 
						"engDesc":"Entering Straight Overpass Course",
						"jpnDesc":"直進方向の高架道路の進入",
						"chnDesc":"直行方向进入高架道路",
						"code":"18"
					},
					{
						"korDesc":"오른쪽 첫번째 진입", 
						"engDesc":"Entering The First Right",
						"jpnDesc":"右の最初の進入",
						"chnDesc":"右边第一个进入",
						"code":"15"
					},
					{
						"korDesc":"오른쪽 두번째 진입", 
						"engDesc":"Entering Second Right",
						"jpnDesc":"右から二番目の進入",
						"chnDesc":"右边第二个进入",
						"code":"16"
					},
					{
						"korDesc":"왼쪽 진입", 
						"engDesc":"Entering Left",
						"jpnDesc":"左進入",
						"chnDesc":"左边进入",
						"code":"13"
					},
					{
						"korDesc":"오른쪽 진입", 
						"engDesc":"Entering Right",
						"jpnDesc":"右進入",
						"chnDesc":"进入右边",
						"code":"14"
					},
					{
						"korDesc":"4시방향", 
						"engDesc":"4 O'Clock Direction",
						"jpnDesc":"4時方向",
						"chnDesc":"4时方向",
						"code":"11"
					},
					{
						"korDesc":"5시방향", 
						"engDesc":"5 O'Clock Direction",
						"jpnDesc":"5時方向",
						"chnDesc":"5时方向",
						"code":"12"
					},
					{
						"korDesc":"오른쪽 고가도로옆길", 
						"engDesc":"Right Side Road Of Overpass",
						"jpnDesc":"右高架道路の沿道",
						"chnDesc":"右边高架路的旁路",
						"code":"21"
					},
					{
						"korDesc":"왼쪽 고가도로옆길", 
						"engDesc":"Left Side Road Of Overpass",
						"jpnDesc":"左高架道路の沿道",
						"chnDesc":"左边高架路的旁路",
						"code":"20"
					},
					{
						"korDesc":"로타리 9시방향", 
						"engDesc":"Rotary Turn At 9 O'Clock",
						"jpnDesc":"ロータリー9時方向",
						"chnDesc":"环岛9时方向",
						"code":"109"
					},
					{
						"korDesc":"로타리 8시방향", 
						"engDesc":"Rotary Turn At 8 O'Clock",
						"jpnDesc":"ロータリー8時方向",
						"chnDesc":"环岛8时方向",
						"code":"108"
					},
					{
						"korDesc":"로타리 7시방향", 
						"engDesc":"Rotary Turn At 7 O'Clock",
						"jpnDesc":"ロータリー7時方向",
						"chnDesc":"环岛7时方向",
						"code":"107"
					},
					{
						"korDesc":"로타리 6시방향", 
						"engDesc":"Rotary Turn At 6 O'Clock",
						"jpnDesc":"ロータリー6時方向",
						"chnDesc":"环岛6时方向",
						"code":"106"
					},
					{
						"korDesc":"목적지 부근", 
						"engDesc":"Near The Destination",
						"jpnDesc":"目的地付近",
						"chnDesc":"目的地附近",
						"code":"64"
					},
					{
						"korDesc":"로타리 5시방향", 
						"engDesc":"Rotary Turn At 5 O'Clock",
						"jpnDesc":"ロータリー5時方向",
						"chnDesc":"环岛5时方向",
						"code":"105"
					},
					{
						"korDesc":"경로 이탈", 
						"engDesc":"Deviate From Course",
						"jpnDesc":"ルート離脱",
						"chnDesc":"脱离路径",
						"code":"65"
					},
					{
						"korDesc":"로타리 4시방향", 
						"engDesc":"Rotary Turn At 4 O'Clock",
						"jpnDesc":"ロータリー4時方向",
						"chnDesc":"环岛4时方向",
						"code":"104"
					},
					{
						"korDesc":"경로 안내 시작", 
						"engDesc":"Start Route Guidance",
						"jpnDesc":"経路案内スタート",
						"chnDesc":"开始导航",
						"code":"62"
					},
					{
						"korDesc":"로타리 3시방향", 
						"engDesc":"Rotary Turn At 3 O'Clock",
						"jpnDesc":"ロータリー3時方向",
						"chnDesc":"环岛3时方向",
						"code":"103"
					},
					{
						"korDesc":"경유지 부근", 
						"engDesc":"Near The Waypoint",
						"jpnDesc":"経由地付近",
						"chnDesc":"经由地附近",
						"code":"63"
					},
					{
						"korDesc":"로타리 2시방향", 
						"engDesc":"Rotary Turn At 2 O'Clock",
						"jpnDesc":"ロータリー2時方向",
						"chnDesc":"环岛2时方向",
						"code":"102"
					},
					{
						"korDesc":"반듯이멘트있는직진", 
						"engDesc":"",
						"jpnDesc":"",
						"chnDesc":"",
						"code":"60"
					},
					{
						"korDesc":"로타리 1시방향", 
						"engDesc":"Rotary Turn At 1 O'Clock",
						"jpnDesc":"ロータリー1時方向",
						"chnDesc":"环岛1时方向",
						"code":"101"
					},
					{
						"korDesc":"신호있는직진", 
						"engDesc":"",
						"jpnDesc":"信号いる直進",
						"chnDesc":"有信号的直行",
						"code":"61"
					},
					{
						"korDesc":"지하차도위U턴", 
						"engDesc":"A Turn On The Underground Road",
						"jpnDesc":"地下車道の上ユーターン",
						"chnDesc":"地下车道上掉头",
						"code":"49"
					},
					{
						"korDesc":"고가밑U턴", 
						"engDesc":"Turn Under The Overhead",
						"jpnDesc":"高架下ユーターン",
						"chnDesc":"在高架下掉头",
						"code":"48"
					},
					{
						"korDesc":"조건부좌회전", 
						"engDesc":"",
						"jpnDesc":"条件部左折",
						"chnDesc":"",
						"code":"45"
					},
					{
						"korDesc":"비보호좌회전", 
						"engDesc":"Unprotected Left Turn",
						"jpnDesc":"非保護左折",
						"chnDesc":"非保护左转",
						"code":"44"
					},
					{
						"korDesc":"P턴", 
						"engDesc":"P-Turn",
						"jpnDesc":"P-Turn",
						"chnDesc":"P-Turn",
						"code":"46"
					},
					{
						"korDesc":"2시방향", 
						"engDesc":"2 O'Clock Direction",
						"jpnDesc":"2時方向",
						"chnDesc":"2时方向",
						"code":"10"
					},
					{
						"korDesc":"오른쪽으로차선변경", 
						"engDesc":"Lane Change To The Right",
						"jpnDesc":"右に車線変更",
						"chnDesc":"向右边变更车道",
						"code":"53"
					},
					{
						"korDesc":"왼쪽으로차선변경", 
						"engDesc":"Lane Change To The Left",
						"jpnDesc":"左に車線変更",
						"chnDesc":"向左边变更车道",
						"code":"54"
					},
					{
						"korDesc":"터널위U턴", 
						"engDesc":"A Turn On The Tunnel",
						"jpnDesc":"トンネルの上ユーターン",
						"chnDesc":"隧道上掉头",
						"code":"50"
					}
				]
			},
			{
				"desc":"guideTypeHighway",
				"code":[
					{
						"korDesc":"도시고속도로 출구로 나가 주세요",
						"engDesc":"Please Exit The Urban Expressway.",
						"jpnDesc":"都市高速道路出口から出てください。",
						"chnDesc":"请去城市高速公路出口。",
						"code":"3"
					},
					{
						"korDesc":"도시고속도로를 갈아 타세요 (도시고속도로JC)",
						"engDesc":"Change The Urban Expressway. (Urban Expressway JC)",
						"jpnDesc":"都市高速道路を乗り換えてください。(都市高速道路JC)",
						"chnDesc":"城市高速公路换上吧。(城市高速公路JC)",
						"code":"2"
					},
					{
						"korDesc":"도시고속도로 입구 진입",
						"engDesc":"Entrance Of Urban Expressway",
						"jpnDesc":"都市高速道路の入り口への進入",
						"chnDesc":"城市高速公路入口进入",
						"code":"1"
					},
					{
						"korDesc":"안내없음",
						"engDesc":"No Guide",
						"jpnDesc":"案内なし",
						"chnDesc":"无指南",
						"code":"0"
					},
					{
						"korDesc":"고속도로 출구로 나가 주세요",
						"engDesc":"Please Go To The Exit Of The Highway.",
						"jpnDesc":"高速道路出口に出てください。",
						"chnDesc":"请走出高速公路出口。",
						"code":"6"
					},
					{
						"korDesc":"고속도로를 갈아 타세요 (고속도로JC)",
						"engDesc":"Please Change To The Highway. (Highway JC)",
						"jpnDesc":"高速道路を乗り換えてください。(高速道路JC)",
						"chnDesc":"请换上高速公路吧。(高速公路JC)。",
						"code":"5"
					},
					{
						"korDesc":"고속도로 입구 진입",
						"engDesc":"Entrance Of Highway",
						"jpnDesc":"高速道路の入り口への進入",
						"chnDesc":"高速公路入口进入",
						"code":"4"
					}
					
				]
			}
		]
	}
}