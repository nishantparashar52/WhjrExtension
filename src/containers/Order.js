import React, { PureComponent } from 'react';
import axios from 'axios';
import OrderList from '../components/OrderList';
// import { showNotification } from '../helper'; // getCookies,
/*global chrome*/

class Order extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orderData: null,
            loader: false
        };
    }
    componentDidMount() {
        this.setState({ loader: true });
        axios.get(`https://api.lenskart.com/v3/orders?page=0&page-size=2`, { headers: { 'x-api-client': 'desktop', 'x-session-token': this.props.sessionToken } })
            .then(res => {
                const orderData = res.data.result && res.data.result.orders;
                this.setState({ orderData, loader: false });
            }).catch(() => {
                this.setState({ orderData: null, loader: false });
            });
        /* let notification = showNotification('', {
            type: "basic",
            title: "Primary Title",
            message: "Primary message to display",
            iconUrl: "/icon.png"
          }, function(data) {
            // alert(data);
        }); */
    }
    render() {
        const { orderData, loader } = this.state;
        const { localizationConfig } = this.props;
        return (
            <div className={'my-extension'}>
                {loader && <div className="loader">
                    <img src="https://static.lenskart.com/media/desktop/img/loader.gif" alt="ldr" />
                </div>}
                {orderData && <OrderList OrderData={orderData} localizationConfig={localizationConfig} />}
            </div>
        )
    }
}
export default Order;