// raid.flow
// 触发：时辰已到
// 定时备份插件设置、触发和流程，对于需要在多台电脑或者手机之间切换登录的人会有用，时间可以自己改。
// 备份插件设置
@js WG.make_config()
$wait 1000
// 备份流程触发
@js Server.uploadConfig()