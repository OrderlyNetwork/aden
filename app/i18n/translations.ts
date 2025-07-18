export type Language = 'KO' | 'EN';

export interface TranslationDictionary {
  [key: string]: {
    KO: string;
    EN: string;
  };
}

const translations: TranslationDictionary = {
  'common.trading': {
    KO: '거래',
    EN: 'Trading'
  },
  'common.portfolio': {
    KO: '내 자산',
    EN: 'Portfolio'
  },
  'common.markets': {
    KO: '마켓',
    EN: 'Markets'
  },
  'common.demo': {
    KO: '모의투자',
    EN: 'Demo'
  },
  'tradingLeaderboard.leaderboard': {
    KO: '리더보드',
    EN: 'Leaderboard'
  },
  'affiliate.referral': {
    KO: '추천',
    EN: 'Referral'
  },
  // nav related translations
  'nav.home': {
    KO: '홈',
    EN: 'Home'
  },
  'nav.chat': {
    KO: '채팅',
    EN: 'Chat'
  },
  'nav.guide': {
    KO: '가이드',
    EN: 'Guide'
  },
  'nav.gateio': {
    KO: 'Gate.io',
    EN: 'Gate.io'
  },
  'nav.trading': {
    KO: '거래',
    EN: 'Trading'
  },
  'nav.portfolio': {
    KO: '내 자산',
    EN: 'Portfolio'
  },
  'nav.markets': {
    KO: '마켓',
    EN: 'Markets'
  },
  'nav.leaderboard': {
    KO: '리더보드',
    EN: 'Leaderboard'
  },
  'nav.referral': {
    KO: '레퍼럴',
    EN: 'Referral'
  },
  'nav.futures': {
    KO: '모의투자',
    EN: 'Demo'
  },
  'nav.rewards': {
    KO: '보상',
    EN: 'Rewards'
  },
  'nav.cryptoData': {
    KO: '코인 데이터',
    EN: 'Crypto Data'
  },
  'nav.community': {
    KO: '커뮤니티',
    EN: 'Community'
  },
  'nav.ranking': {
    KO: '랭킹',
    EN: 'Ranking'
  },
  'nav.market': {
    KO: '마켓',
    EN: 'Market'
  },
  'nav.bugscoinDoc': {
    KO: '벅스코인 문서',
    EN: 'BUGSCOIN DOC'
  },

  // guide related translations
  'guide.whatIsAnttalk': {
    KO: '개미톡이란?',
    EN: 'What is ANTTALK?'
  },
  'guide.demoTradingGuide': {
    KO: '모의투자 참여방법',
    EN: 'Demo Trading Guide'
  },
  'guide.miningGuide': {
    KO: '벅스코인 채굴방법',
    EN: 'Mining Guide'
  },
  'guide.swapGuide': {
    KO: '벅스코인 스왑방법',
    EN: 'Swap Guide'
  },
  'guide.anttalkTitle': {
    KO: '개미톡은 Bugscoin 프로젝트의 생태계를 구성하는 핵심 플랫폼입니다.',
    EN: 'ANTTALK is a core platform that forms the ecosystem of the Bugscoin project.'
  },
  'guide.anttalkDesc': {
    KO: '개미톡은 암호화폐에 관심 있는 사람들이 정보를 공유하고 소통하는 커뮤니티 플랫폼이자, 거래 플랫폼을 사용하여 수수료를 환급받을 수 있는 코인 선물 모의 투자 플랫폼입니다.',
    EN: 'ANTTALK is a community platform where people interested in cryptocurrencies gather to share information and communicate with each other, and a simulation trading site where they can receive a fee back from using the trading platform.'
  },
  'guide.communityPlatform': {
    KO: '커뮤니티 플랫폼',
    EN: 'Community Platform'
  },
  'guide.communityPlatformDesc': {
    KO: '암호화폐와 관련된 토론, 정보 공유, 네트워킹이 이루어지는 공간입니다.',
    EN: 'A space where discussions, information sharing, and networking related to cryptocurrencies are conducted.'
  },
  'guide.demoTrading': {
    KO: '모의 선물투자',
    EN: 'Demo Trading'
  },
  'guide.demoTradingDesc': {
    KO: '누구나 로그인만 하면 암호화폐 모의 거래에 수수료 없이 참여할 수 있습니다.',
    EN: 'Anyone can participate in the monthly cryptocurrency simulation trading without any fees by simply logging in.'
  },
  'guide.miningReward': {
    KO: '벅스코인 채굴 보상',
    EN: 'Bugscoin Mining Reward'
  },
  'guide.miningRewardDesc': {
    KO: '모의 거래에 참여함으로써 일정량의 벅스코인을 보상으로 채굴할 수 있습니다.',
    EN: 'By participating in Demo Trading, you can mine a certain amount of Bugscoin as a reward.'
  },
  'guide.bgscSwap': {
    KO: '벅스코인 스왑',
    EN: 'BGSC Swap'
  },
  'guide.bgscSwapDesc': {
    KO: '모의 거래를 통해 얻은 벅스코인을 거래소로 스왑할 수 있습니다.',
    EN: 'You can swap the BGSC obtained through Demo Trading to an exchange.'
  },

  'chat.placeholder': {
    KO: '채팅을 입력하세요',
    EN: 'Enter your chat message'
  },
  // crypto related translations
  'crypto.bitcoin': {
    KO: '비트코인',
    EN: 'Bitcoin'
  },
  'crypto.ethereum': {
    KO: '이더리움',
    EN: 'Ethereum'
  },

  // data related translations
  'data.analyze': {
    KO: '분석',
    EN: 'Analyze'
  },
  'data.news': {
    KO: '뉴스',
    EN: 'News'
  },

  'Free': {
    KO: '무료',
    EN: 'Free'
  },
  'Analysis': {
    KO: '분석',
    EN: 'Analysis'
  },
  'Notice': {
    KO: '공지사항',
    EN: 'Notice'
  },
  'Help desk': {
    KO: '고객센터',
    EN: 'Help desk'
  },


  // community related translations
  'community.best': {
    KO: '인기글',
    EN: 'Best'
  },
  'community.free': {
    KO: '자유게시판',
    EN: 'Free Board'
  },
  'community.analysis': {
    KO: '분석게시판',
    EN: 'Analysis Board'
  },
  'community.help_desk': {
    KO: '고객센터',
    EN: 'Help desk'
  },
  'community.freeBoard': {
    KO: '자유게시판',
    EN: 'Free Board'
  },
  'community.analysisBoard': {
    KO: '분석게시판',
    EN: 'Analysis Board'
  },
  'community.notice': {
    KO: '공지사항',
    EN: 'Notice'
  },
  'community.helpDesk': {
    KO: '고객센터',
    EN: 'Help desk'
  },

  // board related translations
  'board.community': {
    KO: '커뮤니티',
    EN: 'Community'
  },
  'board.title': {
    KO: '제목',
    EN: 'Title'
  },
  'board.author': {
    KO: '작성자',
    EN: 'Author'
  },
  'board.date': {
    KO: '날짜',
    EN: 'Date'
  },
  'board.views': {
    KO: '조회수',
    EN: 'Views'
  },
  'board.likes': {
    KO: '좋아요',
    EN: 'Likes'
  },
  'board.searchTitle': {
    KO: '제목',
    EN: 'Title'
  },
  'board.searchAuthor': {
    KO: '작성자',
    EN: 'Author'
  },
  'board.write': {
    KO: '글쓰기',
    EN: 'Write'
  },
  'board.list': {
    KO: '목록',
    EN: 'List'
  },
  'board.search': {
    KO: '검색',
    EN: 'Search'
  },
  'board.searchAllPlaceholder': {
    KO: '제목, 내용, 작성자로 검색...',
    EN: 'Search by title, content, author...'
  },
  'board.searchResults': {
    KO: '검색 결과',
    EN: 'Search Results'
  },
  'board.searchResultCount': {
    KO: '개의 검색 결과',
    EN: 'search results'
  },
  'board.searching': {
    KO: '검색 중...',
    EN: 'Searching...'
  },
  'board.noSearchResults': {
    KO: '검색 결과가 없습니다.',
    EN: 'No search results found.'
  },
  'board.notice': {
    KO: '공지',
    EN: 'Notice'
  },
  'board.event': {
    KO: '이벤트',
    EN: 'Event'
  },
  'board.support': {
    KO: '고객지원',
    EN: 'Support'
  },
  'board.noPosts': {
    KO: '게시물이 없습니다.',
    EN: 'There are no posts.'
  },
  'board.otherPostsBy': {
    KO: '님의 다른글',
    EN: 'Other posts by'
  },
  'board.noOtherPosts': {
    KO: '다른글 내역이 없습니다.',
    EN: 'There are no posts.'
  },
  'board.comments': {
    KO: '댓글',
    EN: 'Comments'
  },
  'board.commentPlaceholder': {
    KO: '댓글을 입력하세요. 부적합한 글은 삭제됩니다.',
    EN: 'Enter your comment, Defamatory comments will be deleted.'
  },
  'board.postComment': {
    KO: '댓글 달기',
    EN: 'Post Comment'
  },
  'board.searchPlaceholder': {
    KO: '검색어를 입력하세요',
    EN: 'Enter search text'
  },

  // ranking related translations
  'ranking.ranking': {
    KO: '랭킹',
    EN: 'Ranking'
  },
  'ranking.top100': {
    KO: '탑 100',
    EN: 'Top 100'
  },
  'ranking.hallOfFame': {
    KO: '명예의 전당',
    EN: 'Hall of Fame'
  },
  'ranking.rank': {
    KO: '순위',
    EN: 'Rank'
  },
  'ranking.member': {
    KO: '회원',
    EN: 'Member'
  },
  'ranking.username': {
    KO: '유저명',
    EN: 'Member'
  },
  'ranking.profit': {
    KO: '수익',
    EN: 'Total Profit'
  },
  'ranking.day': {
    KO: '일차',
    EN: 'Day'
  },
  'ranking.totalProfit': {
    KO: '총 수익',
    EN: 'Total Profit'
  },
  'ranking.todayProfit': {
    KO: '오늘 수익',
    EN: 'Today\'s Profit'
  },
  'ranking.totalVolume': {
    KO: '총 거래량',
    EN: 'Total Volume'
  },
  'ranking.tradingFee': {
    KO: '거래 수수료',
    EN: 'Trading Fee'
  },
  'ranking.fundingFee': {
    KO: '펀딩비',
    EN: 'Funding Fee'
  },
  'ranking.scrollHint': {
    KO: '← 좌우로 스크롤하여 더 많은 데이터 보기 →',
    EN: '← Scroll horizontally to see more data →'
  },

  // auth related translations
  'auth.login': {
    KO: '로그인',
    EN: 'Login'
  },
  'auth.signup': {
    KO: '회원가입',
    EN: 'Sign up'
  },
  'auth.logout': {
    KO: '로그아웃',
    EN: 'Logout'
  },
  'auth.cellPhone': {
    KO: '휴대폰',
    EN: 'Cell phone'
  },

  // footer related translations
  'footer.privacyPolicy': {
    KO: '개인보호정책',
    EN: 'Privacy Policy'
  },
  'footer.termsOfUse': {
    KO: '이용약관',
    EN: 'Terms of Use'
  },
  'footer.youthProtectionPolicy': {
    KO: '청소년보호정책',
    EN: 'Youth protection policy'
  },
  'footer.operatingPolicy': {
    KO: '운영정책',
    EN: 'Operating policy'
  },
  'footer.companyName': {
    KO: '회사명',
    EN: 'Company name'
  },
  'footer.companyNameValue': {
    KO: '주식회사 개미톡',
    EN: 'Gamitok Co., Ltd.'
  },
  'footer.representative': {
    KO: '대표',
    EN: 'representative'
  },
  'footer.representativeName': {
    KO: '조인범',
    EN: 'Inbeom Jo'
  },
  'footer.registrationNumber': {
    KO: '등록번호',
    EN: 'Registration number'
  },
  'footer.customerService': {
    KO: '고객센터',
    EN: 'customer service center'
  },
  'footer.businessReportNumber': {
    KO: '통신판매업 신고번호',
    EN: 'Mail order business report number'
  },
  'footer.businessReportValue': {
    KO: '제 2024-별내-0276 호',
    EN: 'No. 2024-Byeolnae-0276'
  },
  'footer.address': {
    KO: '주소',
    EN: 'address'
  },
  'footer.addressValue': {
    KO: '경기도 남양주시 별내중앙로 26, 10층 1002-제이65호(별내동)',
    EN: '#1002-J65, 10th floor, 26 Byeolnaejungang-ro, Namyangju-si, Gyeonggi-do (Byeolnae-dong)'
  },

  // main related translations
  'main.notice': {
    KO: '공지사항',
    EN: 'Notice'
  },
  'main.bbs': {
    KO: '유저 게시물',
    EN: 'BBS'
  },
  'main.futuresStatus': {
    KO: 'BGSC 선물 전광판',
    EN: 'BGSC Futures status'
  },
  'main.currentPrice': {
    KO: '코인 선물 전광판',
    EN: 'Current Price'
  },
  'main.name': {
    KO: '종목명',
    EN: 'Name'
  },
  'main.price': {
    KO: '현재가',
    EN: 'Current Price'
  },
  'main.markPrice': {
    KO: '표시가',
    EN: 'Mark Price'
  },
  'main.change': {
    KO: '대비',
    EN: 'Change'
  },
  'main.changePercent': {
    KO: '등락률',
    EN: 'Change Percent'
  },
  'main.high': {
    KO: '고가',
    EN: 'High'
  },
  'main.low': {
    KO: '저가',
    EN: 'Low'
  },
  'main.volume': {
    KO: '거래량',
    EN: 'Volume'
  },
  'main.profitRanking': {
    KO: '수익 랭킹',
    EN: 'Profit Ranking'
  },
  'main.bugsRanking': {
    KO: '벅스 랭킹',
    EN: 'BUGS Ranking'
  },
  'main.rank': {
    KO: '순위',
    EN: 'Rank'
  },
  'main.country': {
    KO: '국가',
    EN: 'Country'
  },
  'main.profit': {
    KO: '수익 (원)',
    EN: 'Profit (KRW)'
  },
  'main.bugs': {
    KO: '벅스',
    EN: 'BUGS'
  },
  'main.humanIndicator': {
    KO: '인간 지표',
    EN: 'Human Indicator'
  },
  'main.humanIndicatorDesc': {
    KO: '개미톡 코인 모의투자에서 회원들의 롱/숏 포지션에 대한 지표을 표시합니다. (회원수)',
    EN: 'Displays the ratio of simulated investments within ANTTALK intuitively. (number of users)'
  },
  'main.fearGreedIndex': {
    KO: '공포 / 탐욕 지수',
    EN: 'Fear & Greed Index'
  },
  'main.longShortRatio': {
    KO: '전체 롱/숏 비율',
    EN: 'Total Long/Short Ratio'
  },
  'main.longShortRatioDesc': {
    KO: '전체 거래소의 코인선물 롱/숏 비율을 표시합니다. (4시간 기준)',
    EN: 'Displays coin futures long/short ratios for all exchanges. (4hours)'
  },
  'main.cryptoNews': {
    KO: '코인 뉴스',
    EN: 'Crypto News'
  },

  // userInfo related translations
  'userInfo.guest': {
    KO: '회원가입',
    EN: 'Guest'
  },
  'userInfo.loginPrompt': {
    KO: '구글, 네이버 로그인으로 가입해 주세요.',
    EN: 'Please sign up using Google or Naver login.'
  },
  'userInfo.usdt': {
    KO: 'USDT',
    EN: 'USDT'
  },
  'userInfo.bugs': {
    KO: 'BUGS',
    EN: 'BUGS'
  },
  'userInfo.profit': {
    KO: '순손익',
    EN: 'Profit'
  },
  'userInfo.item': {
    KO: '아이템',
    EN: 'ITEM'
  },
  'userInfo.mypage': {
    KO: '마이페이지',
    EN: 'Mypage'
  },
  'userInfo.level': {
    KO: '내계급',
    EN: 'Level'
  },
  'userInfo.maxLevel': {
    KO: '최고계급',
    EN: 'Max'
  },
  'userInfo.more': {
    KO: '더보기',
    EN: 'More'
  },
  'userInfo.usdtTransactions': {
    KO: 'USDT 내역',
    EN: 'USDT Transactions'
  },
  'userInfo.membershipBonus': {
    KO: '회원가입 보너스',
    EN: 'Membership Bonus'
  },
  'userInfo.bugsTransactions': {
    KO: '벅스 내역',
    EN: 'BUGS Transactions'
  },
  'userInfo.liquidationExample': {
    KO: '선물청산 - BTCUSDT 매도 (32,778,745) - 벅스 획득 +15',
    EN: 'Liquidation - BTCUSDT Short (32,778,745) - Bugs +15'
  },
  'userInfo.noData': {
    KO: '내역이 없습니다.',
    EN: 'There are no data.'
  },
  'userInfo.useItem': {
    KO: '아이템 사용',
    EN: 'Use Item'
  },
  'userInfo.leverage100x': {
    KO: '레버리지 100x',
    EN: 'Leverage 100x'
  },
  'userInfo.leverage100xDesc': {
    KO: '레버리지를 x100까지 사용합니다.',
    EN: 'Use leverage up to 100x'
  },
  'userInfo.useItemNow': {
    KO: '지금 사용하기',
    EN: 'Use Item Now'
  },
  'userInfo.owned': {
    KO: '보유',
    EN: 'Owned'
  },
  'userInfo.usdtRecharge': {
    KO: 'USDT 재충전',
    EN: 'USDT Recharge'
  },
  'userInfo.usdtRechargeDesc': {
    KO: 'USDT를 기본 금액으로 충전하고 초기화 합니다.',
    EN: 'Recharge your USDT balance for futures trading'
  },
  'userInfo.positionSpy': {
    KO: '포지션 훔쳐보기',
    EN: 'Position Spy'
  },
  'userInfo.positionSpyDesc': {
    KO: '다른 회원의 포지션을 훔쳐 봅니다.',
    EN: 'View other traders\' positions'
  },

  // chat related translations
  'chat.onlineUsers': {
    KO: '온라인 접속자',
    EN: 'Online Users'
  },
  'chat.findUser': {
    KO: '회원 검색',
    EN: 'Find User'
  },
  'chat.liquidatedPosition': {
    KO: '님이 비트코인 매도 포지션',
    EN: 'liquidated Ethereum short position of'
  },
  'chat.liquidateAmount': {
    KO: '원 청산하여',
    EN: 'KRW, Acquire'
  },
  'chat.acquireBugs': {
    KO: '벅스를 획득 하였습니다.',
    EN: 'BUGS'
  },
  'chat.liquidatedLongPosition': {
    KO: '님이 비트코인 매수 포지션',
    EN: 'liquidated Ethereum long position of'
  },
  'chat.liquidated': {
    KO: '원 청산 하였습니다.',
    EN: 'liquidated'
  },

  // alert related translations
  'alert.loginRequired': {
    KO: '로그인 후 이용 가능합니다.',
    EN: 'Available after logging in.'
  },
  'alert.checkQtyPrice': {
    KO: '가능 수량이 아닙니다. 구매금액과 가능금액을 확인하십시오.',
    EN: 'This is not the possible quantity. Please check the Qty and Price.'
  },
  'alert.enterOrderQty': {
    KO: '주문수량을 입력하여 주십시오.',
    EN: 'Please enter the order quantity.'
  },
  'alert.noOrdersToCancel': {
    KO: '취소할 주문이 없습니다.',
    EN: 'There are no orders to cancel.'
  },
  'alert.liquidatePositions': {
    KO: '[충전불가] 포지션에 체결된 주문을 모두 청산 후 시도하세요.',
    EN: '[Unable to recharge] Please try again after liquidating all orders concluded in the position.'
  },
  'alert.noSearchResults': {
    KO: '조회 결과가 없습니다.',
    EN: 'There are no search results'
  },
  'alert.selectDate': {
    KO: '날짜를 선택하여 주십시오.',
    EN: 'Please select a date.'
  },

  // trading related translations
  'trading.chartDisclaimer': {
    KO: '* ADEN은 TradingView를 통해 실시간 차트를 제공하므로 BTCUSD를 포함한 다양한 종목을 손쉽게 추적할 수 있습니다. 사용자 친화적인 인터랙티브 차트와 다양한 분석 도구로 시장 분석이 훨씬 더 효율적이고 부드러워집니다.',
    EN: '* ADEN provides real-time charts through TradingView, allowing you to easily track various symbols including BTCUSD. The user-friendly interactive charts and various analysis tools make market analysis much more efficient and smooth.'
  },
  'trading.usdtFutures': {
    KO: 'USDT 선물',
    EN: 'USDT Futures'
  },
  'trading.limit': {
    KO: '지정가',
    EN: 'Limit'
  },
  'trading.market': {
    KO: '시장가',
    EN: 'Market'
  },
  'trading.price': {
    KO: '주문가격',
    EN: 'Price'
  },
  'trading.currentPriceAtPurchase': {
    KO: '구매시 현재가',
    EN: 'Current price at purchase'
  },
  'trading.last': {
    KO: '현재가',
    EN: 'Last'
  },
  'trading.qty': {
    KO: '주문수량',
    EN: 'Qty'
  },
  'trading.buyPrice': {
    KO: '매수가격',
    EN: 'Buy price'
  },
  'trading.sellPrice': {
    KO: '매도가격',
    EN: 'Sell price'
  },
  'trading.buySize': {
    KO: '매수금액',
    EN: 'Buy size'
  },
  'trading.sellSize': {
    KO: '매도금액',
    EN: 'Sell size'
  },
  'trading.buyLong': {
    KO: '매수',
    EN: 'Buy'
  },
  'trading.sellShort': {
    KO: '매도',
    EN: 'Sell'
  },
  'trading.value': {
    KO: '금액',
    EN: 'Value'
  },
  'trading.balance': {
    KO: '보유',
    EN: 'Balance'
  },
  'trading.available': {
    KO: '가능',
    EN: 'Available'
  },
  'trading.forcedLiquidation': {
    KO: '강제 청산',
    EN: 'Forced Liquidation'
  },
  'trading.exchangeRate': {
    KO: '환율',
    EN: 'exchange rate'
  },
  'trading.fee': {
    KO: '수수료',
    EN: 'fee'
  },
  'trading.recharge': {
    KO: '재충전',
    EN: 'Recharge'
  },
  'trading.orderBook': {
    KO: '호가창',
    EN: 'Order Book'
  },
  'trading.recentTrades': {
    KO: '최근거래',
    EN: 'Recent Trades'
  },
  'trading.time': {
    KO: '시간',
    EN: 'Time'
  },
  'trading.position': {
    KO: '포지션',
    EN: 'Position'
  },
  'trading.currentOrders': {
    KO: '미체결주문',
    EN: 'Curret Orders'
  },
  'trading.orderHistory': {
    KO: '주문내역',
    EN: 'Order History'
  },
  'trading.closeAll': {
    KO: '일괄 청산',
    EN: 'Close all'
  },
  'trading.cancelAll': {
    KO: '일괄 취소',
    EN: 'Cancel all'
  },
  'trading.unrealizedPNL': {
    KO: '미실현 손익',
    EN: 'Unrealized PNL'
  },
  'trading.roe': {
    KO: '투자수익률',
    EN: 'ROE'
  },
  'trading.pMargin': {
    KO: '포지션 마진',
    EN: 'P.Margin'
  },
  'trading.mMargin': {
    KO: '유지 마진',
    EN: 'M.Margin'
  },
  'trading.entryPrice': {
    KO: '주문가',
    EN: 'Entry Price'
  },
  'trading.currentPrice': {
    KO: '현재가',
    EN: 'Current price'
  },
  'trading.liqPrice': {
    KO: '강제청산가',
    EN: 'Liq.Pirce'
  },
  'trading.closePosition': {
    KO: '포지션 청산',
    EN: 'Close Position'
  },
  'trading.symbol': {
    KO: '심볼',
    EN: 'Symbol'
  },
  'trading.direction': {
    KO: '구매방식',
    EN: 'Direction'
  },
  'trading.quantity': {
    KO: '수량',
    EN: 'Qty'
  },
  'trading.orderPrice': {
    KO: '주문가격',
    EN: 'Order price'
  },
  'trading.orderType': {
    KO: '주문타입',
    EN: 'Order Type'
  },
  'trading.orderID': {
    KO: '주문 ID',
    EN: 'Order ID'
  },
  'trading.createdAt': {
    KO: '생성 시간',
    EN: 'Created At'
  },
  'trading.cancel': {
    KO: '취소',
    EN: 'Action'
  },
  'trading.status': {
    KO: '상태',
    EN: 'Status'
  },
  'trading.liquidationPrice': {
    KO: '청산가',
    EN: 'liquidation price'
  },
  'trading.pnl': {
    KO: '마감손익',
    EN: 'P&L'
  },
  'trading.openingFee': {
    KO: '체결수수료',
    EN: 'Opening Fee'
  },
  'trading.closedFee': {
    KO: '청산수수료',
    EN: 'Closed Fee'
  },
  'trading.fundingFee': {
    KO: '자금 수수료',
    EN: 'Funding Fee'
  },
  'trading.total': {
    KO: '총량',
    EN: 'Total'
  },
  'trading.executionPrice': {
    KO: '체결 가격',
    EN: 'Execution Price'
  },
  'trading.tradeType': {
    KO: '거래 유형',
    EN: 'Trade Type'
  },
  'trading.closingPnl': {
    KO: '청산 PnL',
    EN: 'Closing PnL'
  },
  'trading.entryFee': {
    KO: '진입 수수료',
    EN: 'Entry Fee'
  },
  'trading.closingFee': {
    KO: '청산 수수료',
    EN: 'Closing Fee'
  },
  'trading.liquidationType': {
    KO: '청산 유형',
    EN: 'Liquidation Type'
  },
  'trading.liquidationTime': {
    KO: '청산 시간',
    EN: 'Liquidation Time'
  },
  'trading.usdtPerpetual': {
    KO: 'USDT 선물거래',
    EN: 'USDT Perpetual'
  },
  'trading.indexPrice': {
    KO: '인덱스 가격',
    EN: 'Index Price'
  },
  'trading.24hChange': {
    KO: '변경률(24H)',
    EN: '24H Change %'
  },
  'trading.24hHigh': {
    KO: '최고가(24H)',
    EN: '24H High'
  },
  'trading.24hLow': {
    KO: '최저가(24H)',
    EN: '24H Low'
  },
  'trading.24hTurnover': {
    KO: '턴오버(24H/USDT)',
    EN: '24H Turnover(USDT)'
  },
  'trading.24hVolume': {
    KO: '거래량(24H/BTC)',
    EN: '24H Volume(CoinName)'
  },
  'trading.openInterest': {
    KO: '미결제약정(24H/BTC)',
    EN: 'Open Interest()'
  },
  'trading.fundingRate': {
    KO: '펀딩율 / 남은시간',
    EN: 'Funding Rate / Countdown'
  },
  'trading.1m': {
    KO: '1분',
    EN: '1m'
  },
  'trading.indicators': {
    KO: '지표',
    EN: 'Indicators'
  },
  'trading.volume': {
    KO: '거래량',
    EN: 'Volume'
  },
  'trading.6m': {
    KO: '6분',
    EN: '6m'
  },
  'trading.3m': {
    KO: '3분',
    EN: '3m'
  },
  'trading.1d': {
    KO: '1날',
    EN: '1d'
  },
  'trading.5d': {
    KO: '5날',
    EN: '5d'
  },
  'trading.1month': {
    KO: '1달',
    EN: '1m'
  },
  'trading.log': {
    KO: '로그',
    EN: 'log'
  },
  'trading.auto': {
    KO: '자동',
    EN: 'auto'
  },
  'trading.cross': {
    KO: '교차',
    EN: 'Cross'
  },
  'trading.sound': {
    KO: '알림음',
    EN: 'Sound'
  },
  'trading.liquidation': {
    KO: '강제청산',
    EN: 'forced liquidation'
  },
  'trading.contracts': {
    KO: '종목',
    EN: 'Contracts'
  },
  'trading.initialMargin': {
    KO: '개시증거금',
    EN: 'P. Margin'
  },
  'trading.maintenanceMargin': {
    KO: '유지증거금',
    EN: 'M. Margin'
  },
  'trading.unrealizedPnl': {
    KO: '미실현손익',
    EN: 'Unrealized P&L'
  },
  'trading.realizedPnl': {
    KO: '마감순손익',
    EN: 'Relized P&L'
  },
  'trading.action': {
    KO: '청산',
    EN: 'Action'
  },
  'trading.tradingType': {
    KO: '거래타입',
    EN: 'Direction'
  },
  'trading.orderNo': {
    KO: '주문번호',
    EN: 'Order No'
  },
  'trading.orderTime': {
    KO: '주문시간',
    EN: 'Order Time'
  },
  'trading.selectDate': {
    KO: '날짜선택',
    EN: 'Select date'
  },
  'trading.search': {
    KO: '날짜조회',
    EN: 'Search'
  },
  'trading.recentSearch': {
    KO: '최근조회 (24시간)',
    EN: 'Recent Search (24 hours)'
  },
  'trading.tradePrice': {
    KO: '체결가',
    EN: 'Trade Price'
  },
  'trading.todaySearch': {
    KO: '오늘조회',
    EN: 'Today Search'
  },
  'trading.fundingFees': {
    KO: '펀딩수수료',
    EN: 'Funding Fees'
  },
  'trading.type': {
    KO: '청산타입',
    EN: 'Type'
  },
  'trading.tradeTime': {
    KO: '청산시간',
    EN: 'Trade Time'
  },

  // demoGuide related translations
  'demoGuide.googleSignup': {
    KO: '구글 회원가입',
    EN: 'Google Signup'
  },
  'demoGuide.googleSignupDesc': {
    KO: '구글 계정으로 회원가입을 완료하면 100,000 USDT의 가상 자금을 받게 됩니다.',
    EN: 'After completing the signup with your Google account, you will receive 100,000 USDT in virtual funds.'
  },
  'demoGuide.naverEndingSoon': {
    KO: '* 네이버 계정은 종료 예정입니다.',
    EN: '* Naver account is scheduled to be discontinued.'
  },
  'demoGuide.crossIsolated': {
    KO: '크로스 / 격리 투자',
    EN: 'Cross / Isolated Investment'
  },
  'demoGuide.crossIsolatedDesc': {
    KO: '격리 또는 크로스를 선택하여 거래할 수 있습니다.',
    EN: 'You can trade by selecting Isolated or Cross.'
  },
  'demoGuide.leverage': {
    KO: '레버리지 투자',
    EN: 'Leverage Investment'
  },
  'demoGuide.leverageDesc': {
    KO: '현재 자금의 배수를 통해 거래할 수 있습니다. 최대 x50까지 가능하며, 아이템을 사용하면 x100도 가능합니다.',
    EN: 'You can trade with a multiple of your current funds through leverage. It is possible up to x50, and if you use an item, it is also possible to use x100.'
  },
  'demoGuide.recharge': {
    KO: '재충전',
    EN: 'Recharge'
  },
  'demoGuide.rechargeDesc': {
    KO: '하루에 한 번 100,000 USDT를 재충전할 수 있습니다. 아이템을 사용하면 하루에 여러 번 재충전도 가능합니다.',
    EN: 'You can recharge 100,000 USDT once a day. If you use an item, you can also recharge multiple times a day.'
  },
  'demoGuide.tradeableItems': {
    KO: '거래 가능 종목',
    EN: 'Tradeable Items'
  },
  'demoGuide.tradeableItemsDesc': {
    KO: 'BTC(비트코인)과 ETH(이더리움)을 거래할 수 있으며, 앞으로 더 많은 코인에 대한 모의 거래를 지원할 예정입니다.',
    EN: 'There are BTC(Bitcoin) and ETH(Ethrium), and we plan to support Demo Trading for more coins in the future.'
  },

  // miningGuide related translations
  'miningGuide.basicMining': {
    KO: '기본 채굴 방법',
    EN: 'Basic Mining Method'
  },
  'miningGuide.miningExample': {
    KO: '관리자님이 비트코인 매도 포지션 +30,907,314원을 청산하여 +15 벅스를 획득 하였습니다.',
    EN: 'ADMIN liquidated Bitcoin short position of \'; +30,907,314 KRW, Acquire +15 BUGS'
  },
  'miningGuide.miningReward': {
    KO: '모의 거래에서 포지션을 종료하고 +10,000 USDT의 이익을 얻으면 5 5 벅스를 보상으로 받을 수 있습니다.',
    EN: 'When you close a position in Demo Trading and earn a profit of +10,000 USDT, you can receive 5 BUGS as a reward.'
  },
  'miningGuide.paymentNote': {
    KO: '* 해당 지급은 추후 변경될 수 있습니다.',
    EN: '* The payment amount can be changed later'
  },
  'miningGuide.holderBenefits': {
    KO: '벅스코인 홀더 혜택',
    EN: 'BUGSCOIN Holder Benefits'
  },
  'miningGuide.holderBenefitsDesc': {
    KO: '벅스코인 홀더는 BUGSTALK에서 보유한 BUGSCOIN 수에 따라 더 높은 등급과 모의 거래 채굴 혜택을 받습니다.',
    EN: 'BUGSCoin holders benefit from higher ranks and Demo Trading mining due to the number of BUGS they hold in ANTTALK.'
  },
  'miningGuide.tier1Reward': {
    KO: '1 ~ 10 : 매 채굴 성공 시, 3BUGS 추가 채굴',
    EN: '1 ~ 10 : every mining success, 3BUGS additional mining'
  },
  'miningGuide.tier2Reward': {
    KO: '11 ~ 20 : 매 채굴 성공 시, 4BUGS 추가 채굴',
    EN: '11 ~ 20 : every mining success, 4BUGS additional mining'
  },
  'miningGuide.tier3Reward': {
    KO: '21 ~ 30 : 매 채굴 성공 시, 5BUGS 추가 채굴',
    EN: '21 ~ 30 : every mining success, 5BUGS additional mining'
  },
  'miningGuide.tier4Reward': {
    KO: '31 ~ 40 : 매 채굴 성공 시, 6BUGS 추가 채굴',
    EN: '31 ~ 40 : every mining success, 6BUGS additional mining'
  },
  'miningGuide.tier5Reward': {
    KO: '41 ~ 50 : 매 채굴 성공 시, 7BUGS 추가 채굴',
    EN: '41 ~ 50 : every mining success, 7BUGS additional mining'
  },
  'miningGuide.tier6Reward': {
    KO: '51 ~ 60 : 매 채굴 성공 시, 8BUGS 추가 채굴',
    EN: '51 ~ 60 : every mining success, 8BUGS additional mining'
  },
  'miningGuide.tier7Reward': {
    KO: '61 ~ 70 : 매 채굴 성공 시, 9BUGS 추가 채굴',
    EN: '61 ~ 70 : every mining success, 9BUGS additional mining'
  },
  'miningGuide.tier8Reward': {
    KO: '71 ~ 80 : 매 채굴 성공 시, 10BUGS 추가 채굴',
    EN: '71 ~ 80 : every mining success, 10BUGS additional mining'
  },
  'miningGuide.tier9Reward': {
    KO: '81 ~ 90 : 매 채굴 성공 시, 11BUGS 추가 채굴',
    EN: '81 ~ 90 : every mining success, 11BUGS additional mining'
  },
  'miningGuide.tier10Reward': {
    KO: '91 ~ 99 : 매 채굴 성공 시, 12BUGS 추가 채굴',
    EN: '91 ~ 99 : every mining success, 12BUGS additional mining'
  },
  'miningGuide.levelUpdate': {
    KO: '회원 레벨에 따라 채굴 보상이 다르게 분배되도록 업데이트할 계획입니다.',
    EN: '* We plan to update the mining rewards to be distributed differently based on user levels*'
  },

  // swapGuide related translations
  'swapGuide.swapMethod': {
    KO: '벅스코인 스왑 신청 방법',
    EN: 'How to Apply for BGSC Swap'
  },
  'swapGuide.swapMethodDesc': {
    KO: '모의 거래를 통해 얻은 벅스코인을 마이페이지의 지갑 탭에서 거래소로 스왑할 수 있습니다.',
    EN: 'You can swap the BGSC obtained through Demo Trading to an exchange from the Wallet tab in your Mypage.'
  },
  'swapGuide.swapSchedule': {
    KO: '스왑은 주 1회 열립니다.',
    EN: 'Swap is open once a week.'
  },
  'swapGuide.swapRatio': {
    KO: '스왑 비율은 주간 채굴량에 따라 달라집니다.',
    EN: 'The swap ratio varies depending on the amount mined during the week.'
  },
  'swapGuide.swapWallet': {
    KO: '개미톡에서 제공하는 거래소 추천 링크를 통해 가입한 지갑으로만 스왑할 수 있습니다.',
    EN: 'You can only swap to the wallet you joined through the exchange referral link provided by ANTTALK.'
  },
  'swapGuide.swapWarning': {
    KO: '스왑 주의사항',
    EN: 'Swap Warning'
  },
  'swapGuide.swapCheckItems': {
    KO: '스왑 신청 시 다음 사항을 확인하세요:',
    EN: 'When applying for a swap, please check the following:'
  },
  'swapGuide.checkAddress': {
    KO: '올바른 지갑 주소를 입력했는지 확인하세요',
    EN: 'Check if you have entered the correct wallet address'
  },
  'swapGuide.checkReferral': {
    KO: 'ANTTALK 추천 링크를 통해 가입한 거래소의 BGSC 지갑 주소인지 확인하세요',
    EN: 'Check if the BGSC wallet address is from the exchange you joined through the ANTTALK referral link'
  },
  'swapGuide.noCancellation': {
    KO: '스왑 신청 후 취소가 불가능하므로 주의하세요',
    EN: 'Please be careful when applying for a swap as it cannot be canceled after application'
  },

  // gateio related translations
  'gateio.timeRemaining': {
    KO: '대회 시작까지 남은 시간',
    EN: 'Time Until Tournament Start'
  },
  'gateio.contestStarted': {
    KO: '대회가 시작되었습니다!',
    EN: 'The contest has begun!'
  },
  'gateio.prizeInfo': {
    KO: '상금안내',
    EN: 'Prize Information'
  },
  'gateio.firstPlace': {
    KO: '1등',
    EN: '1st place'
  },
  'gateio.secondPlace': {
    KO: '2등',
    EN: '2nd place'
  },
  'gateio.thirdPlace': {
    KO: '3등',
    EN: '3rd place'
  },
  'gateio.fourthToTenth': {
    KO: '4-10등',
    EN: '4th to 10th Place'
  },
  'gateio.tournamentInfo': {
    KO: '대회 정보',
    EN: 'Tournament Information'
  },
  'gateio.applicationPeriod': {
    KO: '신청 기간',
    EN: 'Application Period'
  },
  'gateio.appPeriodDates': {
    KO: '2025년 2월 28일 21:00 ~ 2025년 3월 16일 24:00',
    EN: 'February 28, 2025 21:00 ~ March 16, 2025 24:00'
  },
  'gateio.competitionPeriod': {
    KO: '대회 기간',
    EN: 'Competition Period'
  },
  'gateio.compPeriodDates': {
    KO: '2025년 3월 10일 18:00 ~ 2025년 4월 16일 24:00',
    EN: 'March 10, 2025 18:00 ~ April 16, 2025 24:00'
  },
  'gateio.eligibility': {
    KO: '참가 자격',
    EN: 'Eligibility'
  },
  'gateio.eligibilityReq': {
    KO: 'BUGSCOIN 레퍼럴로 Gate.io 거래소 회원가입 및 KYC 인증 완료',
    EN: 'Sign up for Gate.io through the BUGSCOIN referral and complete KYC verification.'
  },
  'gateio.totalPrize': {
    KO: '총 상금',
    EN: 'Total Prize'
  },
  'gateio.importantNotice': {
    KO: '주의사항',
    EN: 'Important Notice'
  },
  'gateio.realCompetition': {
    KO: '본 대회는 Gate.io 에서 진행되는 실제 투자 거래량 대회입니다',
    EN: 'This competition is a real investment trading volume competition held on Gate.io.'
  },
  'gateio.applyInfo': {
    KO: '하단의 Gate.io 가입하러 가기 버튼을 통해 회원가입, KYC 인증 완료 된 계정으로 대회 신청이 가능합니다 (기존의 개미톡 레퍼럴 가입자는 동일하게 신청 가능합니다.)',
    EN: 'You can apply for the competition with an account that has completed registration and KYC verification via the '
  },
  'gateio.disqualification': {
    KO: '비정상적인 방법으로 참여하는 경우 참여 자격 취소 및 상금 박탈 처리됩니다.',
    EN: 'Participation using abnormal methods will result in disqualification and forfeiture of prizes.'
  },
  'gateio.inquiries': {
    KO: '추가 문의사항은 하단의 고객센터 문의 버튼을 통해 문의 바랍니다.',
    EN: 'For further inquiries, please contact customer support via the button below.'
  },
  'gateio.customerSupport': {
    KO: '개미톡 고객센터 바로가기',
    EN: 'Go to ANTTALK Customer Support'
  },
  'gateio.signUp': {
    KO: '대회 신청하러 가기',
    EN: 'Sign Up Now'
  },

  // tradingModal related translations
  'tradingModal.precautions': {
    KO: '모의투자 유의사항',
    EN: 'Simulated investment precautions'
  },
  'tradingModal.mockContent': {
    KO: 'ANTTALK 컨텐츠는 실제 거래(체결)이 되지 않는 모의투자 컨텐츠 입니다.',
    EN: 'ANTTALK content is mock investment content that does not result in actual transactions (conclusions).'
  },
  'tradingModal.virtualPoints': {
    KO: 'ANTTALK USDT는 가상의 포인트로 현금으로 충전 및 환전이 불가능 하며\n커뮤니티 활동을 통해 획득할 수 있습니다.',
    EN: 'ANTTALK USDT is a virtual point that cannot be charged or exchanged for cash and can be obtained through community activities.'
  },
  'tradingModal.understood': {
    KO: '이해하고 확인하였음',
    EN: 'ANTTALK USDT is a virtual point that cannot be charged or exchanged for cash and can be obtained through community activities.'
  },
  'tradingModal.dontShow24h': {
    KO: '24시간 안보기',
    EN: 'Don\'t watch for 24 hours'
  },

  // marginModal related translations
  'marginModal.chooseMode': {
    KO: '증거금(마진) 모드 변경',
    EN: 'Choose Margin Mode'
  },
  'marginModal.cross': {
    KO: '교차(Cross)',
    EN: 'Cross'
  },
  'marginModal.isolated': {
    KO: '격리(Isolated)',
    EN: 'Isolated'
  },
  'marginModal.liquidationWarning': {
    KO: '손해가 전체 보유금액(60%) 이상시 청산합니다.',
    EN: 'If the loss exceeds the total holding amount (60%), it will be liquidated.'
  },
  'marginModal.positionEffect': {
    KO: '변경시 현종목 모든 포지션, 미체결주문이 영향 받습니다.',
    EN: 'When changed, all positions and unfilled orders for the current item will be affected.'
  },
  'marginModal.confirm': {
    KO: '확인',
    EN: 'Confirm'
  },
  'marginModal.cancel': {
    KO: '취소',
    EN: 'Cancel'
  },

  // leverageModal related translations
  'leverageModal.adjustLeverage': {
    KO: '레버리지 변경',
    EN: 'Adjust Leverage'
  },
  'leverageModal.leverage': {
    KO: '레버리지 비율',
    EN: 'Leverage'
  },
  'leverageModal.leverageLimit': {
    KO: '기본 x50배까지 가능하며 아이템 사용시 x100배까지 가능합니다.',
    EN: 'It can be multiplied by up to x50 by default x, and can be multiplied by x100 when using items.'
  },
  'leverageModal.quantityRatio': {
    KO: '보유금액에 대한 주문 가능 수량비를 가감합니다.',
    EN: 'Add or subtract the quantity ratio that can be ordered based on the amount held.'
  },
  'leverageModal.positionEffect': {
    KO: '변경시 현종목 모든 포지션, 미체결주문이 영향을 받습니다.',
    EN: 'When changed, all positions and unfilled orders for the current item will be affected.'
  },

  // limitCloseBtn related translations
  'limitCloseBtn.limitClose': {
    KO: '지정가 반대구매',
    EN: 'Limit Close'
  },
  'limitCloseBtn.price': {
    KO: '구매가격',
    EN: 'Price'
  },
  'limitCloseBtn.qty': {
    KO: '구매수량',
    EN: 'Qty'
  },

  // marketCloseBtn related translations
  'marketCloseBtn.marketClose': {
    KO: '시장가 청산',
    EN: 'Market Close'
  },

  // bulkCloseBtn related translations
  'bulkCloseBtn.liquidateAll': {
    KO: '전체 청산하기',
    EN: 'Liquidate All'
  },
  'bulkCloseBtn.confirmLiquidate': {
    KO: '전체 포지션을 청산하시겠습니까?',
    EN: 'Do you want to liquidate your entire position?'
  },

  // usdtTrans related translations
  'usdtTrans.ethLongLiquidation': {
    KO: 'Liquidation - ETHUSDT Long (Entry 1868.84, Close 1880.99)',
    EN: '선물청산 - ETHUSDT 매수 (진입 1868.84, 청산 1880.99)'
  },
  'usdtTrans.ethShortLiquidation': {
    KO: 'Liquidation - ETHUSDT Short (Entry 1868.84, Close 1880.99)',
    EN: '선물청산 - ETHUSDT 매도 (진입 1868.84, 청산 1880.99)'
  },

  // analysis related translations
  'analysis.live': {
    KO: '실시간',
    EN: 'Live'
  },
  'analysis.totalLiquidations': {
    KO: '총 청산',
    EN: 'Total Liquidations'
  },
  'analysis.exchange': {
    KO: '거래소',
    EN: 'Exchange'
  },
  'analysis.symbol': {
    KO: '심볼',
    EN: 'Symbol'
  },
  'analysis.all': {
    KO: '전체',
    EN: 'All'
  },
  'analysis.hour': {
    KO: '시간',
    EN: 'hour'
  },
  'analysis.hourAgo': {
    KO: '시간 전',
    EN: 'hour'
  },
  'analysis.hoursAgo': {
    KO: '시간 전',
    EN: 'hours'
  },
  'analysis.total': {
    KO: '총청산',
    EN: 'Total'
  },
  'analysis.long': {
    KO: '롱청산',
    EN: 'Long'
  },
  'analysis.short': {
    KO: '숏청산',
    EN: 'Short'
  },
  'analysis.whaleAlert': {
    KO: '고래 경보',
    EN: 'Whale Alert'
  },
  'analysis.tradeOrders': {
    KO: '실시간 거래 주문',
    EN: 'Trade Orders'
  },
  'analysis.totalSum': {
    KO: '총 거래액',
    EN: 'Total Sum'
  },
  'analysis.totalMax': {
    KO: '최고거래액',
    EN: 'Total Max'
  },
  'analysis.numOrders': {
    KO: '거래수',
    EN: 'Number of Orders'
  },
  'analysis.price': {
    KO: '가격',
    EN: 'Price'
  },
  'analysis.totalAmount': {
    KO: '거래액',
    EN: 'Total'
  },
  'analysis.liquidationOrders': {
    KO: '실시간 청산 주문',
    EN: 'Liquidation Orders'
  },
  'analysis.totalLiquiAmount': {
    KO: '총 청산액',
    EN: 'Total'
  },
  'analysis.maxLiquiAmount': {
    KO: '최고 청산액',
    EN: 'Total Max'
  },
  'analysis.numLiquidations': {
    KO: '청산수',
    EN: 'Number of Orders'
  },
  'analysis.liquidationMap': {
    KO: '코인 청산맵',
    EN: 'Liquidation Map'
  },
  'analysis.1d': {
    KO: '1일',
    EN: '1d'
  },
  'analysis.7d': {
    KO: '7일',
    EN: '7d'
  },
  'analysis.leverage': {
    KO: '레버리지',
    EN: 'Leverage'
  },
  'analysis.cumulative': {
    KO: '청산합',
    EN: 'Cumulative'
  },
  'analysis.longShortRatio': {
    KO: '롱/숏 비율',
    EN: 'Long/Short Ratio'
  },
  'analysis.5m': {
    KO: '5분',
    EN: '5m'
  },
  'analysis.15m': {
    KO: '15분',
    EN: '15m'
  },
  'analysis.30m': {
    KO: '30분',
    EN: '30m'
  },
  'analysis.1h': {
    KO: '1시간',
    EN: '1h'
  },
  'analysis.4h': {
    KO: '4시간',
    EN: '4h'
  },
  'analysis.12h': {
    KO: '12시간',
    EN: '12h'
  },
  'analysis.24h': {
    KO: '24시간',
    EN: '24h'
  },
  'analysis.longTrade': {
    KO: '롱거래',
    EN: 'Long'
  },
  'analysis.shortTrade': {
    KO: '숏거래',
    EN: 'Short'
  },
  'analysis.fearGreed': {
    KO: '공포 / 탐욕 지수',
    EN: 'Fear & Greed'
  },
  'analysis.date': {
    KO: '날짜',
    EN: 'Date'
  },
  'analysis.extremeFear': {
    KO: '극단적 공포',
    EN: 'Extreme Fear'
  },
  'analysis.fear': {
    KO: '공포',
    EN: 'Fear'
  },
  'analysis.neutral': {
    KO: '중립',
    EN: 'Neutral'
  },
  'analysis.greed': {
    KO: '낙관',
    EN: 'Greed'
  },
  'analysis.extremeGreed': {
    KO: '극단적 낙관',
    EN: 'Extreme Greed'
  },
  'analysis.index': {
    KO: '지수',
    EN: 'Index'
  },
  'analysis.altcoinIndex': {
    KO: '알트코인 지수',
    EN: 'Altcoin Index'
  },
  'analysis.now': {
    KO: '현재',
    EN: 'Now'
  },
  'analysis.yesterday': {
    KO: '어제',
    EN: 'Yesterday'
  },
  'analysis.lastWeek': {
    KO: '지난주',
    EN: 'Last Week'
  },
  'analysis.lastMonth': {
    KO: '지난달',
    EN: 'Last Month'
  },
  'analysis.yearlyHigh': {
    KO: '연간최고',
    EN: 'Yearly High'
  },
  'analysis.yearlyLow': {
    KO: '연간최저',
    EN: 'Yearly Low'
  },
  'analysis.marketCap': {
    KO: '시가총액',
    EN: 'Market Cap.'
  },
  'analysis.seasonIndex': {
    KO: '시즌지수',
    EN: 'Season Index'
  },
  'analysis.altcoinSeason': {
    KO: '알트코인 시즌',
    EN: 'Altcoin Season'
  },
  'analysis.coinName': {
    KO: '코인명',
    EN: 'Name'
  },
  'analysis.percentChange': {
    KO: '변동률',
    EN: 'Percent Change'
  },
  'analysis.rsiHeatmap': {
    KO: 'RSI 히트맵',
    EN: 'RSI Heatmap'
  },
  'analysis.priceChange4h': {
    KO: '가격변동률(4h)',
    EN: 'Price Change(4h)'
  },
  'analysis.1w': {
    KO: '1주',
    EN: '1w'
  },
  'analysis.coinHeatmap': {
    KO: '코인 히트맵',
    EN: 'Coin Heatmap'
  },
  'analysis.allExchange': {
    KO: '전체 거래소',
    EN: 'All Exchange'
  },
  'analysis.exchangeHeatmap': {
    KO: '거래소 히트맵',
    EN: 'Exchange Heatmap'
  },
  'analysis.allCoin': {
    KO: '전체 코인',
    EN: 'All Coin'
  },

  'analysis': {
    KO: '분석',
    EN: 'Analysis'
  },

  'news': {
    KO: '뉴스',
    EN: 'News'
  },

  // news related translations
  'news.site': {
    KO: '제공 사이트',
    EN: 'Site'
  },
  'news.all': {
    KO: '전체',
    EN: 'All'
  },
  'news.tokenpost': {
    KO: '토큰포스트',
    EN: 'Tokenpost'
  },
  'news.coinness': {
    KO: '코인니스',
    EN: 'Coinness'
  },
  'news.minsAgo': {
    KO: '분전',
    EN: 'mins'
  },

  // boardAlert related translations
  'boardAlert.recommended': {
    KO: '해당 게시물을 추천하셨습니다.',
    EN: 'You recommended this post.'
  },
  'boardAlert.confirmDelete': {
    KO: '해당 게시물을 정말 삭제하시겠습니까?',
    EN: 'Are you sure you want to delete this post?'
  },
  'boardAlert.cannotRecommendOwn': {
    KO: '본인의 글을 추천할 수 없습니다.',
    EN: 'You cannot recommend your own writing.'
  },

  // top100 related translations
  'top100.ranking': {
    KO: '랭킹',
    EN: 'Ranking'
  },
  'top100.rank': {
    KO: '순위',
    EN: 'Rank'
  },
  'top100.member': {
    KO: '회원',
    EN: 'Member'
  },
  'top100.totalProfit': {
    KO: '총 순손익',
    EN: 'Total Profit'
  },
  'top100.todayProfit': {
    KO: '오늘 순손익',
    EN: 'Today\'s Profit'
  },
  'top100.totalVolume': {
    KO: '총 거래량',
    EN: 'Total Volume'
  },
  'top100.tradingFee': {
    KO: '거래 수수료',
    EN: 'Trading Fee'
  },
  'top100.fundingFee': {
    KO: '펀딩 수수료',
    EN: 'Funding Fee'
  },

  // hallOfFame related translations
  'hallOfFame.nth': {
    KO: '제',
    EN: 'th'
  },
  'hallOfFame.times': {
    KO: '회',
    EN: 'th'
  },
  'hallOfFame.mockInvestmentTop3': {
    KO: '모의투자 대회 TOP3',
    EN: 'Mock Investment Competition TOP3'
  },
  'hallOfFame.dailyTrading': {
    KO: '데일리 모의투자 대회',
    EN: 'Daily Trading Competition'
  },
  'hallOfFame.guildTop3': {
    KO: '길드 대항전 TOP3',
    EN: 'Guild Competition TOP3'
  },
  'hallOfFame.rank': {
    KO: '순위',
    EN: 'Rank'
  },
  'hallOfFame.member': {
    KO: '회원',
    EN: 'Member'
  },
  'hallOfFame.totalProfit': {
    KO: '총순손익',
    EN: 'Total Profit'
  },
  'hallOfFame.day': {
    KO: '날짜',
    EN: 'Day'
  },

  // market related translations
  'market.market': {
    KO: '마켓',
    EN: 'Market'
  },
  'market.itemShop': {
    KO: '아이템샵',
    EN: 'Item Shop'
  },
  'market.myItem': {
    KO: '내 아이템',
    EN: 'My Item'
  },
  'market.leverage100x': {
    KO: '레버리지 x100 가능권',
    EN: 'Leverage 100x'
  },
  'market.leverage100xDesc': {
    KO: '24시간 동안 레버리지를 x100까지 사용합니다',
    EN: 'Use leverage up to 100x for 24 hours'
  },
  'market.duration24h': {
    KO: '기간 24 hour',
    EN: 'Duration: 24 hour'
  },
  'market.positionSpy': {
    KO: '포지션 훔쳐보기',
    EN: 'Position Spy'
  },
  'market.positionSpyDesc': {
    KO: '24시간 동안 다른 회원의 포지션을 훔쳐봅니다.벅스',
    EN: 'View other traders\' positions for 24 hour'
  },
  'market.usdtRecharge': {
    KO: 'USDT 재충전',
    EN: 'USDT Recharge'
  },
  'market.usdtRechargeDesc': {
    KO: 'USDT를 기본 금액으로 충전하고 초기화 합니다.',
    EN: 'Recharge your USDT balance for futures trading'
  },
  'market.bugs': {
    KO: '벅스',
    EN: 'BUGS'
  },
  'market.stock': {
    KO: '재고',
    EN: 'Stock'
  },
  'market.quantity': {
    KO: '수량',
    EN: 'Quantity'
  },
  'market.purchase': {
    KO: '구매하기',
    EN: 'Purchase'
  },
  'market.item': {
    KO: '개',
    EN: 'Item'
  },
  'market.items': {
    KO: '아이템',
    EN: 'items'
  },
  'market.confirmPurchase': {
    KO: '개를 보유벅스로 구매 하시겠습니까?',
    EN: 'Would you like to purchase 1 items with your own Bugs?'
  },

  // myInfo related translations
  'myInfo.myInformation': {
    KO: '내정보',
    EN: 'My information'
  },
  'myInfo.myInfo': {
    KO: '내정보',
    EN: 'My info'
  },
  'myInfo.wallet': {
    KO: '지갑',
    EN: 'Wallet'
  },
  'myInfo.account': {
    KO: '계정',
    EN: 'Account'
  },
  'myInfo.id': {
    KO: '아이디',
    EN: 'ID'
  },
  'myInfo.joinDate': {
    KO: '가입일',
    EN: 'Join date'
  },
  'myInfo.password': {
    KO: '비밀번호',
    EN: 'password'
  },
  'myInfo.encryptedByAuth': {
    KO: '구글 또는 네이버가 암호화',
    EN: 'Encrypted by Google or Naver'
  },
  'myInfo.name': {
    KO: '이름',
    EN: 'Name'
  },
  'myInfo.email': {
    KO: '이메일',
    EN: 'Email'
  },
  'myInfo.certification': {
    KO: '본인 인증',
    EN: 'Certification'
  },
  'myInfo.noVerification': {
    KO: '미인증',
    EN: 'No Verification'
  },
  'myInfo.edit': {
    KO: '수정',
    EN: 'Edit'
  },
  'myInfo.community': {
    KO: '커뮤니티',
    EN: 'Community'
  },
  'myInfo.nickname': {
    KO: '닉네임',
    EN: 'Nickname'
  },
  'myInfo.buyItem': {
    KO: '구매',
    EN: 'Buy Item'
  },
  'myInfo.profilePic': {
    KO: '프로필 사진',
    EN: 'Profile Pic'
  },
  'myInfo.optimizationSize': {
    KO: '권장 크기',
    EN: 'Optimization Size'
  },
  'myInfo.prohibitImages': {
    KO: '문제적 이미지 금지',
    EN: 'Prohibition of problematic images'
  },
  'myInfo.unsubscribe': {
    KO: '회원탈퇴',
    EN: 'Unsubscribe'
  },
  'myInfo.withdrawMembership': {
    KO: '탈퇴하기',
    EN: 'Withdrawal of membership'
  },

  // common related translations
  'common.krw': {
    KO: '원',
    EN: 'KRW'
  },

  // item related translations
  'item.leverage100x': {
    KO: '레버리지 x100',
    EN: 'Leverage x100'
  },
  'item.positionSpy': {
    KO: '포지션 훔쳐보기',
    EN: 'Position Spy'
  },
  'item.usdtRecharge': {
    KO: 'USDT 재충전',
    EN: 'USDT Recharge'
  },
  'item.periodItems': {
    KO: '기간 아이템',
    EN: 'Period Items'
  },
  'item.basicItems': {
    KO: '기본 아이템',
    EN: 'Basic Items'
  },
  'item.loading': {
    KO: '로딩 중...',
    EN: 'Loading...'
  },
  'item.count': {
    KO: '개',
    EN: ' items'
  },
  'item.noItem': {
    KO: '아이템 없음',
    EN: 'No items'
  },
  'item.useNow': {
    KO: '바로사용',
    EN: 'Use Now'
  },

  // usdt related translations
  'usdt.holding': {
    KO: 'USDT 보유량',
    EN: 'USDT Holdings'
  },
  'usdt.todayEarned': {
    KO: '오늘 획득',
    EN: 'Today Earned'
  },
  'usdt.rankInfo': {
    KO: '계급 정보',
    EN: 'Rank Information'
  },
  'usdt.requiredUsdt': {
    KO: '필요 USDT',
    EN: 'Required USDT'
  },
  'usdt.transactionHistory': {
    KO: 'USDT 거래 내역',
    EN: 'USDT Transaction History'
  },
  'usdt.selectDate': {
    KO: '날짜선택',
    EN: 'Select Date'
  },
  'usdt.startDate': {
    KO: '시작일 선택',
    EN: 'Select Start Date'
  },
  'usdt.endDate': {
    KO: '종료일 선택',
    EN: 'Select End Date'
  },
  'usdt.reset': {
    KO: '초기화',
    EN: 'Reset'
  },
  'usdt.start': {
    KO: '시작',
    EN: 'Start'
  },
  'usdt.end': {
    KO: '종료',
    EN: 'End'
  },
  'usdt.today': {
    KO: '오늘',
    EN: 'Today'
  },
  'usdt.days': {
    KO: '일',
    EN: 'Days'
  },
  'usdt.all': {
    KO: '전체',
    EN: 'All'
  },
  'usdt.date': {
    KO: '날짜',
    EN: 'Date'
  },
  'usdt.content': {
    KO: '내용',
    EN: 'Content'
  },
  'usdt.loading': {
    KO: '로딩 중...',
    EN: 'Loading...'
  },
  'usdt.dataLoadFail': {
    KO: '데이터를 불러오는데 실패했습니다.',
    EN: 'Failed to load data.'
  },
  'usdt.noTransactions': {
    KO: '거래 내역이 없습니다.',
    EN: 'No transaction history.'
  },
  'usdt.buy': {
    KO: '매수',
    EN: 'Buy'
  },
  'usdt.sell': {
    KO: '매도',
    EN: 'Sell'
  },

  // bugs related translations
  'bugs.holding': {
    KO: '벅스 보유량',
    EN: 'BUGS Holdings'
  },
  'bugs.todayEarned': {
    KO: '오늘 획득',
    EN: 'Today Earned'
  },
  'bugs.transactionHistory': {
    KO: '벅스 거래 내역',
    EN: 'BUGS Transaction History'
  },
  'bugs.selectDate': {
    KO: '날짜선택',
    EN: 'Select Date'
  },
  'bugs.startDate': {
    KO: '시작일 선택',
    EN: 'Select Start Date'
  },
  'bugs.endDate': {
    KO: '종료일 선택',
    EN: 'Select End Date'
  },
  'bugs.reset': {
    KO: '초기화',
    EN: 'Reset'
  },
  'bugs.start': {
    KO: '시작',
    EN: 'Start'
  },
  'bugs.end': {
    KO: '종료',
    EN: 'End'
  },
  'bugs.today': {
    KO: '오늘',
    EN: 'Today'
  },
  'bugs.days': {
    KO: '일',
    EN: 'Days'
  },
  'bugs.all': {
    KO: '전체',
    EN: 'All'
  },
  'bugs.date': {
    KO: '날짜',
    EN: 'Date'
  },
  'bugs.content': {
    KO: '내용',
    EN: 'Content'
  },
  'bugs.loading': {
    KO: '로딩 중...',
    EN: 'Loading...'
  },
  'bugs.dataLoadFail': {
    KO: '데이터를 불러오는데 실패했습니다.',
    EN: 'Failed to load data.'
  },
  'bugs.noTransactions': {
    KO: '거래 내역이 없습니다.',
    EN: 'No transaction history.'
  },
  'bugs.buy': {
    KO: '매수',
    EN: 'Buy'
  },
  'bugs.sell': {
    KO: '매도',
    EN: 'Sell'
  },
  'bugs.enterAmount': {
    KO: '금액을 입력해주세요.',
    EN: 'Please enter an amount.'
  },
  'bugs.withdrawalAddress': {
    KO: '출금 주소',
    EN: 'Withdrawal Address'
  },
  'bugs.network': {
    KO: '네트워크',
    EN: 'Network'
  },
  'bugs.submit': {
    KO: '신청',
    EN: 'Submit Withdrawal'
  },
  'bugs.submitWithdrawal': {
    KO: '출금 신청',
    EN: 'Submit Withdrawal'
  },
  'bugs.withdraw': {
    KO: '출금',
    EN: 'Withdraw'
  },
  'bugs.withdrawal': {
    KO: '출금하기',
    EN: 'Withdrawal'
  },
  'bugs.withdrawAmount': {
    KO: '출금 금액',
    EN: 'Withdrawal Amount'
  },
  'bugs.withdrawalHistory': {
    KO: '출금 내역',
    EN: 'Withdrawal History'
  },
  'bugs.withdrawalRequest': {
    KO: '출금 요청',
    EN: 'Withdrawal Request'
  },
  'bugs.withdrawalSuccess': {
    KO: '출금 신청이 완료되었습니다.',
    EN: 'Withdrawal request has been completed.'
  },
  'bugs.withdrawalFailed': {
    KO: '출금 신청에 실패했습니다.',
    EN: 'Withdrawal request failed.'
  },
  'bugs.minimumWithdrawal': {
    KO: '최소 출금 금액',
    EN: 'Minimum Withdrawal Amount'
  },
  'bugs.maximumWithdrawal': {
    KO: '최대 출금 금액',
    EN: 'Maximum Withdrawal Amount'
  },
  'bugs.availableBalance': {
    KO: '출금 가능 잔액',
    EN: 'Available Balance'
  },
  'bugs.withdrawalFee': {
    KO: '출금 수수료',
    EN: 'Withdrawal Fee'
  },
  'bugs.finalAmount': {
    KO: '실제 출금액',
    EN: 'Final Amount'
  },
  'bugs.processingTime': {
    KO: '처리 시간',
    EN: 'Processing Time'
  },
  'bugs.withdrawalStatus': {
    KO: '출금 상태',
    EN: 'Withdrawal Status'
  },
  'bugs.pending': {
    KO: '대기 중',
    EN: 'Pending'
  },
  'bugs.processing': {
    KO: '처리 중',
    EN: 'Processing'
  },
  'bugs.completed': {
    KO: '완료',
    EN: 'Completed'
  },
  'bugs.cancelled': {
    KO: '취소됨',
    EN: 'Cancelled'
  },
  'bugs.failed': {
    KO: '실패',
    EN: 'Failed'
  },
  'bugs.insufficientBalance': {
    KO: '잔액이 부족합니다.',
    EN: 'Insufficient balance.'
  },
  'bugs.invalidAmount': {
    KO: '올바른 금액을 입력해주세요.',
    EN: 'Please enter a valid amount.'
  },
  'bugs.confirmWithdrawal': {
    KO: '출금을 확인하시겠습니까?',
    EN: 'Are you sure you want to withdraw?'
  },
  'bugs.cancel': {
    KO: '취소',
    EN: 'Cancel'
  },
  'bugs.confirm': {
    KO: '확인',
    EN: 'Confirm'
  },

  // wallet related translations
  'wallet.uidRegistration': {
    KO: 'UID 등록',
    EN: 'UID Registration'
  },
  'wallet.loading': {
    KO: 'UID 정보를 불러오는 중...',
    EN: 'Loading UID information...'
  },
  'wallet.loadFail': {
    KO: '거래소 UID 정보를 불러오는데 실패했습니다.',
    EN: 'Failed to load exchange UID information.'
  },
  'wallet.uid': {
    KO: 'UID',
    EN: 'UID'
  },
  'wallet.info': {
    KO: '정보',
    EN: 'Information'
  },
  'wallet.action': {
    KO: '액션',
    EN: 'Action'
  },
  'wallet.register': {
    KO: '등록하기',
    EN: 'Register'
  },
  'wallet.completed': {
    KO: '완료',
    EN: 'Completed'
  },
  'wallet.processing': {
    KO: '등록중',
    EN: 'Processing'
  },
  'wallet.currentlyUnavailable': {
    KO: '현재 등록 불가능',
    EN: 'Currently Unavailable'
  },
  'wallet.swapApplication': {
    KO: '스왑 신청',
    EN: 'Swap Application'
  },
  'wallet.status': {
    KO: '상태',
    EN: 'Status'
  },
  'wallet.ended': {
    KO: '종료',
    EN: 'Ended'
  },
  'wallet.nextAvailable': {
    KO: '이후 신청 가능',
    EN: 'Available after'
  },
  'wallet.swapHistory': {
    KO: '스왑 거래 내역',
    EN: 'Swap Transaction History'
  },
  'wallet.date': {
    KO: '날짜',
    EN: 'Date'
  },
  'wallet.site': {
    KO: '사이트',
    EN: 'Site'
  },
  'wallet.bugs': {
    KO: '벅스',
    EN: 'BUGS'
  },
  'wallet.bgsc': {
    KO: 'BGSC',
    EN: 'BGSC'
  },
  'wallet.state': {
    KO: '상태',
    EN: 'Status'
  },
  'wallet.noHistory': {
    KO: '스왑 신청 내역이 없습니다.',
    EN: 'No swap application history.'
  },

  // 거래소 수수료 관련 텍스트
  'exchange.bitgetFee': {
    KO: '수수료 83% 페이백, 총 발생 수수료 50% 페이백 [클릭]',
    EN: '83% fee rebate, 50% total fee rebate [Click]'
  },
  'exchange.gateFee': {
    KO: '수수료 페이백 [클릭]',
    EN: 'Fee rebate [Click]'
  },
  'exchange.hashkeyFee': {
    KO: '수수료 100% 페이백 [클릭]',
    EN: '100% fee rebate [Click]'
  },

  // Main page translations
  'ranking.profitRanking': {
    KO: '수익 랭킹',
    EN: 'Profit Ranking'
  },
  'ranking.bugsRanking': {
    KO: '벅스 랭킹',
    EN: 'BUGS Ranking'
  },
  'ranking.bugs': {
    KO: '벅스',
    EN: 'BUGS'
  },
  'ranking.noData': {
    KO: '랭킹 데이터가 없습니다',
    EN: 'No ranking data available'
  },
  'ranking.showLess': {
    KO: '접기',
    EN: 'Show less'
  },
  'ranking.seeMore': {
    KO: '더보기',
    EN: 'See more'
  },

  'community.title': {
    KO: '커뮤니티',
    EN: 'Community'
  },
  'community.bbs': {
    KO: '게시판',
    EN: 'BBS'
  },

  'board.goToBoard': {
    KO: '게시판으로 이동',
    EN: 'Go to board'
  },
  'board.seeMore': {
    KO: '더보기',
    EN: 'See more'
  },

  'liquidation.title': {
    KO: '청산 맵',
    EN: 'Liquidation Map'
  },

  'fearGreed.title': {
    KO: '공포 & 탐욕 지수',
    EN: 'Fear & Greed Index'
  },
  'fearGreed.date': {
    KO: '날짜',
    EN: 'Date'
  },
  'fearGreed.price': {
    KO: '가격',
    EN: 'Price'
  },

  'exchange.liveTradeOrder': {
    KO: '거래소 실시간 거래 내역',
    EN: 'Exchange live Trade order'
  },
  'exchange.live': {
    KO: '실시간',
    EN: 'Live'
  },
  'exchange.filter': {
    KO: '거래소',
    EN: 'Exchange'
  },
  'exchange.symbol': {
    KO: '심볼',
    EN: 'Symbol'
  },
  'exchange.total': {
    KO: '합계',
    EN: 'Total'
  },
  'exchange.totalPrice': {
    KO: '총 가격',
    EN: 'Total Price'
  },
  'exchange.totalSize': {
    KO: '총 규모',
    EN: 'Total Size'
  },
  'exchange.numberOfOrders': {
    KO: '주문 수',
    EN: 'Number of Orders'
  },
  'exchange.exchange': {
    KO: '거래소',
    EN: 'Exchange'
  },
  'exchange.time': {
    KO: '시간',
    EN: 'Time'
  },
  'exchange.price': {
    KO: '가격',
    EN: 'Price'
  },
  'exchange.position': {
    KO: '포지션',
    EN: 'Position'
  },

  'price.currentPrice': {
    KO: '현재 가격',
    EN: 'Current Price'
  },
  'price.name': {
    KO: '이름',
    EN: 'Name'
  },
  'price.price': {
    KO: '가격',
    EN: 'Price'
  },
  'price.markPrice': {
    KO: '마크 가격',
    EN: 'Mark Price'
  },
  'price.changePercent': {
    KO: '변동률',
    EN: 'Change Percent'
  },
  'price.change': {
    KO: '변동률',
    EN: 'Change %'
  },
  'price.high': {
    KO: '고가',
    EN: 'High'
  },
  'price.low': {
    KO: '저가',
    EN: 'Low'
  },
  'price.volume': {
    KO: '거래량',
    EN: 'Volume'
  },

  // Modal auth related translations
  'modal.signIn': {
    KO: '로그인',
    EN: 'Sign In'
  },
  'modal.signUp': {
    KO: '회원가입',
    EN: 'Sign Up'
  },
  'modal.email': {
    KO: '이메일',
    EN: 'Email'
  },
  'modal.password': {
    KO: '비밀번호',
    EN: 'Password'
  },
  'modal.name': {
    KO: '이름',
    EN: 'Name'
  },
  'modal.confirmPassword': {
    KO: '비밀번호 확인',
    EN: 'Confirm Password'
  },
  'modal.emailPlaceholder': {
    KO: '이메일',
    EN: 'email'
  },
  'modal.passwordPlaceholder': {
    KO: '비밀번호',
    EN: 'password'
  },
  'modal.namePlaceholder': {
    KO: '이름을 입력하세요',
    EN: 'Your name'
  },
  'modal.emailAddressPlaceholder': {
    KO: '이메일 주소',
    EN: 'Email address'
  },
  'modal.signingIn': {
    KO: '로그인 중...',
    EN: 'Signing In...'
  },
  'modal.loginButton': {
    KO: '로그인',
    EN: 'Login'
  },
  'modal.dormantAccount': {
    KO: '휴면 혹은 정지된 계정입니다. 고객센터에 문의해주세요!',
    EN: 'Dormant or suspended account. Please contact customer service!'
  },
  'modal.loginError': {
    KO: '로그인 과정에서 오류가 발생했습니다.',
    EN: 'An error occurred during the login process.'
  },
  'modal.fillAllFields': {
    KO: '모든 필수 항목을 입력해주세요',
    EN: 'Please fill in all required fields'
  },
  'modal.passwordMismatch': {
    KO: '비밀번호가 일치하지 않습니다',
    EN: 'Passwords do not match'
  },
  'modal.registrationFailed': {
    KO: '회원가입에 실패했습니다. 다시 시도해주세요.',
    EN: 'Registration failed. Please try again.'
  },

  // Form validation messages
  'form.titleRequired': {
    KO: '제목을 입력해주세요',
    EN: 'Please enter a title'
  },
  'form.contentRequired': {
    KO: '내용을 입력해주세요',
    EN: 'Please enter content'
  },
  'form.titlePlaceholder': {
    KO: '제목을 입력해주세요',
    EN: 'Please enter a title'
  },
  'form.contentPlaceholder': {
    KO: '내용을 입력해주세요',
    EN: 'Please enter content'
  },
  'form.submit': {
    KO: '등록',
    EN: 'Submit'
  },
  'form.submitting': {
    KO: '등록 중...',
    EN: 'Submitting...'
  },

  // UI Chat related translations
  'ui.realTimeChat': {
    KO: '실시간 채팅',
    EN: 'Real-time Chat'
  },

  // Date related translations
  'date.noDate': {
    KO: '날짜 없음',
    EN: 'No date'
  },
  'date.formatError': {
    KO: '날짜 형식 오류',
    EN: 'Date format error'
  },
  'date.parseError': {
    KO: '날짜 파싱 오류',
    EN: 'Date parsing error'
  },
  'date.futureDate': {
    KO: '미래 날짜',
    EN: 'Future date'
  },
  'date.displayError': {
    KO: '날짜 표시 오류',
    EN: 'Date display error'
  },
  'date.processingError': {
    KO: '날짜 처리 오류',
    EN: 'Date processing error'
  },

  // Demo trading related translations
  'demo.long': {
    KO: '롱',
    EN: 'Long'
  },
  'demo.short': {
    KO: '숏',
    EN: 'Short'
  },
  'demo.limitOrder': {
    KO: '지정가',
    EN: 'LIMIT'
  },
  'demo.marketOrder': {
    KO: '시장가',
    EN: 'MARKET'
  },
  'demo.positionTab': {
    KO: '포지션',
    EN: 'Position'
  },
  'demo.orderBookTab': {
    KO: '호가창',
    EN: 'Order Book'
  },
  'demo.pending': {
    KO: '대기중',
    EN: 'PENDING'
  },
  'demo.filled': {
    KO: '체결됨',
    EN: 'FILLED'
  },
  'demo.cancelled': {
    KO: '취소됨',
    EN: 'CANCELLED'
  },
  // Error messages
  'error.loadRankingFailed': {
    KO: '랭킹 데이터 로드에 실패했습니다',
    EN: 'Failed to load ranking data'
  },

  // Filter options
  'filter.all': {
    KO: '전체',
    EN: 'All'
  },
  'filter.neutral': {
    KO: '중립적',
    EN: 'Neutral'
  },

  // Site meta information
  'site.title': {
    KO: 'Anttalk',
    EN: 'ANTTALK'
  },
  'site.description': {
    KO: 'Anttalk 웹사이트',
    EN: 'ANTTALK Website'
  },

  // Modal related translations
  'modal.buySell': {
    KO: '구매하기',
    EN: 'Place Order'
  },
  'modal.symbol': {
    KO: '종목',
    EN: 'Symbol'
  },
  'modal.orderPrice': {
    KO: '주문가격',
    EN: 'Order Price'
  },
  'modal.orderQuantity': {
    KO: '주문수량',
    EN: 'Order Quantity'
  },
  'modal.orderMethod': {
    KO: '구매방식',
    EN: 'Order Method'
  },
  'modal.marketPrice': {
    KO: '시장가',
    EN: 'Market Price'
  },
  'modal.buyLong': {
    KO: '매수 / Long',
    EN: 'Buy / Long'
  },
  'modal.sellShort': {
    KO: '매도 / Short',
    EN: 'Sell / Short'
  },
  'modal.cancel': {
    KO: '취소',
    EN: 'Cancel'
  },
  'modal.confirm': {
    KO: '확인',
    EN: 'Confirm'
  },
  'modal.closeAll': {
    KO: '전체 청산하기',
    EN: 'Close All Positions'
  },
  'modal.closeAllMessage': {
    KO: '모든 포지션을 청산하시겠습니까?\n현재 시장가로 전체 청산됩니다.\n이 작업은 취소할 수 없습니다.',
    EN: 'Are you sure you want to close all positions?\nAll positions will be closed at market price.\nThis action cannot be undone.'
  },
  'modal.limitClose': {
    KO: '지정가 청산하기',
    EN: 'Limit Close'
  },
  'modal.closePrice': {
    KO: '청산가격',
    EN: 'Close Price'
  },
  'modal.closeQuantity': {
    KO: '청산수량',
    EN: 'Close Quantity'
  },
  'modal.cancelAll': {
    KO: '전체 취소하기',
    EN: 'Cancel All Orders'
  },
  'modal.cancelAllMessage': {
    KO: '모든 주문을 취소하시겠습니까?',
    EN: 'Are you sure you want to cancel all orders?'
  },
  'modal.cancelOrder': {
    KO: '취소하기',
    EN: 'Cancel Order'
  },
  'modal.cancelOrderMessage': {
    KO: '주문을 취소하시겠습니까?',
    EN: 'Are you sure you want to cancel this order?'
  },
  'modal.selectLeverage': {
    KO: '레버리지 변경',
    EN: 'Adjust Leverage'
  },
  'modal.leverageDescription': {
    KO: '기본 x{default}배까지 가능하며 \'Leverage 100x\' 아이템 보유로 x{max}배까지 설정 가능합니다.',
    EN: 'Up to x{default} available by default, up to x{max} available with \'Leverage 100x\' item.'
  },
  'modal.leverageDescriptionWithoutItem': {
    KO: '기본 x{default}배까지 가능하며 \'Leverage 100x\' 아이템 사용시 x{max}배까지 가능합니다.',
    EN: 'Up to x{default} available by default, up to x{max} available with \'Leverage 100x\' item.'
  },
  'modal.leverageNote': {
    KO: '보유금액에 대한 주문 가능 수량비를 가감합니다.\n변경시 현종목 모든 포지션, 미체결주문이 영향을 받습니다.',
    EN: 'Adjusts the orderable quantity ratio based on your holdings.\nChanges will affect all positions and pending orders for the current symbol.'
  },
  'modal.registerUID': {
    KO: 'UID 등록',
    EN: 'UID Registration'
  },
  'modal.uidLoading': {
    KO: 'UID 정보를 불러오는 중...',
    EN: 'Loading UID information...'
  },
  'modal.uidLoadFail': {
    KO: '거래소 UID 정보를 불러오는데 실패했습니다.',
    EN: 'Failed to load exchange UID information.'
  },
  'modal.uidPlaceholder': {
    KO: 'UID를 입력하세요',
    EN: 'Enter UID'
  },
  'modal.uidEnterRequired': {
    KO: 'UID를 입력해주세요.',
    EN: 'Please enter UID.'
  },
  'modal.uidRegistrationSuccess': {
    KO: 'UID가 성공적으로 등록되었습니다.',
    EN: 'UID has been successfully registered.'
  },
  'modal.uidRegistrationFailed': {
    KO: 'UID 등록에 실패했습니다. 다시 시도해주세요.',
    EN: 'UID registration failed. Please try again.'
  },
  'modal.close': {
    KO: '닫기',
    EN: 'Close'
  },
  'modal.register': {
    KO: '등록하기',
    EN: 'Register'
  },
  'modal.processing': {
    KO: '처리 중...',
    EN: 'Processing...'
  },
  'modal.complete': {
    KO: '완료',
    EN: 'Complete'
  },
  'modal.profit': {
    KO: '손익:',
    EN: 'P&L:'
  },
  'modal.ranking': {
    KO: '랭킹:',
    EN: 'Ranking:'
  },
  'modal.viewPositions': {
    KO: '포지션 보기',
    EN: 'View Positions'
  },
  'modal.positions': {
    KO: '의 포지션',
    EN: '\'s Positions'
  },
  'modal.noActivePositions': {
    KO: '현재 활성화된 포지션이 없습니다',
    EN: 'No active positions currently'
  },
  'modal.back': {
    KO: '돌아가기',
    EN: 'Back'
  },
  'modal.positionSpyRequired': {
    KO: '포지션 보기에는 "포지션 훔쳐보기" 아이템이 필요합니다.',
    EN: 'Position viewing requires "Position Spy" item.'
  },
  'modal.selectMarginMode': {
    KO: '증거금(마진) 모드 변경',
    EN: 'Change Margin Mode'
  },
  'modal.cross': {
    KO: '교차(Cross)',
    EN: 'Cross'
  },
  'modal.isolated': {
    KO: '격리(Isolated)',
    EN: 'Isolated'
  },
  'modal.crossDescription': {
    KO: '손해가 전체 보유금액(60%) 이상시 청산합니다.\n변경시 현종목 모든 포지션, 미체결주문이 영향 받습니다.',
    EN: 'Liquidation occurs when losses exceed 60% of total holdings.\nChanges will affect all positions and pending orders for the current symbol.'
  },
  'modal.isolatedDescription': {
    KO: '포지션 손해가 포지션 증거금(60%) 이상시 청산됩니다.\n변경시 현종목 모든 포지션, 미체결주문이 영향 받습니다.',
    EN: 'Liquidation occurs when position losses exceed 60% of position margin.\nChanges will affect all positions and pending orders for the current symbol.'
  },
  'modal.useItem': {
    KO: '아이템 사용',
    EN: 'Use Item'
  },
  'modal.useItemMessage': {
    KO: ' 아이템을 사용하시겠습니까?',
    EN: ' item?'
  },
  'modal.useItemQuestion': {
    KO: '아이템을 사용하시겠습니까?',
    EN: 'Do you want to use the'
  },
  'modal.availableQuantity': {
    KO: '보유 수량:',
    EN: 'Available:'
  },
  'modal.useQuantity': {
    KO: '사용 수량:',
    EN: 'Use:'
  },
  'modal.use': {
    KO: '사용하기',
    EN: 'Use'
  },
  'modal.confirmPurchase': {
    KO: '구매 확인',
    EN: 'Confirm Purchase'
  },
  'modal.quantity': {
    KO: '수량:',
    EN: 'Quantity:'
  },
  'modal.totalPrice': {
    KO: '총 가격:',
    EN: 'Total Price:'
  },
  'modal.marketClose': {
    KO: '시장가 청산하기',
    EN: 'Market Close'
  },

  // UID registration specific translations
  'uid.referralInfo1': {
    KO: '개미톡 레퍼럴(추천) 가입시, 수수료 83% 페이백, 총 발생 수수료 50% 페이백',
    EN: 'With ANTTALK referral signup, 83% fee rebate, 50% total fee rebate'
  },
  'uid.referralInfo2': {
    KO: '개미톡 레퍼럴(추천) 가입시만 UID 신청이 정상 완료됩니다.',
    EN: 'UID application is only completed with ANTTALK referral signup.'
  },
  'uid.referralInfo3': {
    KO: '24시간내 신청이 처리됩니다. (일요 또는 휴소)',
    EN: 'Applications are processed within 24 hours (except Sundays or holidays).'
  },
  'uid.referralInfo4': {
    KO: '다른 레퍼럴(추천) 가입 UID는 신청이 불가 합니다.',
    EN: 'UIDs from other referral signups are not accepted.'
  },
  'uid.referralInfo5': {
    KO: '기존 {exchange} 회원은 탈퇴 후 개미톡 레퍼럴(추천) 링크를 통해 재가입 바랍니다.',
    EN: 'Existing {exchange} members should withdraw and re-signup through ANTTALK referral link.'
  },
  'uid.referralSignup': {
    KO: ' - 개미톡 레퍼럴(추천) 가입하기 [클릭]',
    EN: ' - ANTTALK Referral Signup [Click]'
  },
  'uid.referralCode': {
    KO: '레퍼럴(추천) 코드 : ',
    EN: 'Referral Code: '
  },

  // Table headers
  'table.symbol': {
    KO: '심볼',
    EN: 'Symbol'
  },
  'table.direction': {
    KO: '방향',
    EN: 'Direction'
  },
  'table.quantity': {
    KO: '수량',
    EN: 'Quantity'
  },
  'table.entryPrice': {
    KO: '진입가',
    EN: 'Entry Price'
  },

  // Chat report related translations
  'chat.report': {
    KO: '신고',
    EN: 'Report'
  },
  'chat.reportMessage': {
    KO: '메시지 신고',
    EN: 'Report Message'
  },
  'chat.reportReason': {
    KO: '신고 사유',
    EN: 'Report Reason'
  },
  'chat.reportReasonPlaceholder': {
    KO: '신고 사유를 입력해주세요...',
    EN: 'Please enter the reason for reporting...'
  },
  'chat.reportSubmit': {
    KO: '신고하기',
    EN: 'Submit Report'
  },
  'chat.reportCancel': {
    KO: '취소',
    EN: 'Cancel'
  },
  'chat.reportSuccess': {
    KO: '신고가 성공적으로 접수되었습니다.',
    EN: 'Report has been successfully submitted.'
  },
  'chat.reportError': {
    KO: '신고 접수 중 오류가 발생했습니다.',
    EN: 'An error occurred while submitting the report.'
  },
  'chat.reportConfirm': {
    KO: '이 메시지를 신고하시겠습니까?',
    EN: 'Do you want to report this message?'
  },

  // Post report related translations
  'post.report': {
    KO: '신고',
    EN: 'Report'
  },
  'post.reportPost': {
    KO: '게시글 신고',
    EN: 'Report Post'
  },
  'post.reportComment': {
    KO: '댓글 신고',
    EN: 'Report Comment'
  },
  'post.reportReason': {
    KO: '신고 사유',
    EN: 'Report Reason'
  },
  'post.reportReasonPlaceholder': {
    KO: '신고 사유를 입력해주세요...',
    EN: 'Please enter the reason for reporting...'
  },
  'post.reportSubmit': {
    KO: '신고하기',
    EN: 'Submit Report'
  },
  'post.reportCancel': {
    KO: '취소',
    EN: 'Cancel'
  },
  'post.reportSuccess': {
    KO: '신고가 성공적으로 접수되었습니다.',
    EN: 'Report has been successfully submitted.'
  },
  'post.reportError': {
    KO: '신고 접수 중 오류가 발생했습니다.',
    EN: 'An error occurred while submitting the report.'
  },
  'post.reportPostConfirm': {
    KO: '이 게시글을 신고하시겠습니까?',
    EN: 'Do you want to report this post?'
  },
  'post.reportCommentConfirm': {
    KO: '이 댓글을 신고하시겠습니까?',
    EN: 'Do you want to report this comment?'
  },
};

export default translations;