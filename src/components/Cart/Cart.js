import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import CartContext from "../../store/cart-context";

import classes from "./Cart.module.css";

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userdata) => {
    setIsSubmitting(true);
    await fetch(
      "https://react-getting-started-f2983-default-rtdb.firebaseio.com/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userdata,
          orderedItems: cartCtx.items,
        }),
      }
    );
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };
  const cartItem = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          id={item.id}
          amount={item.amount}
          name={item.name}
          price={item.price}
          onAdd={cartItemAddHandler.bind(null, item)} //we do not want to bind an object to the function(assign null to first arg, the followings args will be passed down to the component)
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
        />
      ))}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.onClose}>
        Close
      </button>
      {hasItems && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const modalContent = (
    <React.Fragment>
      {cartItem}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      {!isCheckout && modalActions}
    </React.Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSudmitModalContent = (
    <React.Fragment>
      <p>Successfully sent the order!</p>
      <div className={classes.actions}>
      <button className={classes.button} onClick={props.onClose}>
        Close
      </button>
    </div>
    </React.Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && modalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSudmitModalContent}
    </Modal>
  );
};

export default Cart;
