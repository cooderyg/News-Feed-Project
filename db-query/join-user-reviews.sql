-- 데이터 베이스 선택
use newsfeed_db;

-- reviews 테이블 데이터 보기 
select * from Reviews as R
join Users as U 
on U.userId = R.userId;

-- 앞에 Users 정보가 먼저온다.
-- select * from Users as R
-- join Reviews as U 
-- on U.userId = R.userId;

