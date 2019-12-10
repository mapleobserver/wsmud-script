//raid.flow
//用唐诗清虚弱buff
#input ($EscortWeaponID) = 切换躺尸武器sid,(EscortWeaponID)
#config
($jianfa) = (:kf_jian)
($weapon) = (:eq0)
cha none;enable sword tangshijianfa;eq (EscortWeaponID)
@wait 3000
@cd sword.wu
$to 少林派-东侧殿
kill {r铜人}?
$waitpfm sword.wu
@until (:combating) == false
@cd sword.wu
cha none;enable sword (jianfa);eq (weapon)