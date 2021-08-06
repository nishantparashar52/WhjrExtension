import React from 'react';
import './Items.scss';
const OrderList = props => {
    const { OrderData, localizationConfig = {} } = props;
    const { LABEL_BRAND, STATUS, ORDER_LABEL, DELIVERY_DATE } = localizationConfig;
    return (
        <div className="order-section">
            <div className="card-heading">{ORDER_LABEL}</div>
            {OrderData.map(order => {
                const { deliveryDate } = order;
                return (
                    <div className="order-items" key={order.id}>
                        {
                            order.items.map(item => {
                                const { status } = item;
                                const statusKey = status.status.replace('_', '');
                                const statusLabel = localizationConfig[statusKey] || statusKey;
                                return (<React.Fragment key={item.id}>
                                    <div className="display-flex item" key={item.id}>
                                        <div className="image-container">
                                            <img src={item.thumbnail} alt={item.name} /></div>
                                        <div className="display-flex flex-direction-column">
                                            <div className="margin-b5">{LABEL_BRAND} : {item.brandName}</div>
                                            <div className="display-flex fs12 text-gray flex-direction-column">
                                                {statusKey !== 'DELIVERED' && <div className="margin-r10">{statusLabel}</div>}
                                                {statusKey !== 'DELIVERED' ? <div className="">{DELIVERY_DATE} <span className="bold">{new Date(deliveryDate).toLocaleDateString()}</span></div> : <div className="">{STATUS}: {statusLabel}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>);
                            })
                        }
                    </div>
                );
            })
            }
        </div>
    );
}
export default OrderList;