import React from 'react';

import "../style/index.scss";
import {storageKeys} from 'zn-common/constants';

import loadingGif from 'zn-image/loading.gif';

const Auth = React.createClass({
	getInitialState() {
		return {
			message: ""
		}
	},

	componentDidMount() {
		const query = this.props.location.query;
		this.setState({ message: "正在登陆" });

		// 通过native传入的参数去获取用户sid
		this.props.actions.validateSid(query, (data) => {
			this.setState({ message: "登陆成功" });

			// 更新sid到sessionStorage
			Util.storage.push(storageKeys.SID, data.sid);
			this.context.router.replace("/index");

		}, () => {
			this.setState({ message: "登陆失败,请检查" });
		})
	},

	render() {
		return (
			<div className="auth-page">
				<div style={{ paddingTop: '20%' }}>
					<img src={loadingGif}/>
					<div className="auth-message">{ this.state.message }</div>
				</div>
			</div>
		)
	}
});

export default Auth;