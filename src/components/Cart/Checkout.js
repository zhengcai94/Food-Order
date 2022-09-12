import { useRef, useState } from "react";
import classes from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isFiveChars = (value) => value.trim().length === 6;

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    city: true,
    postalCode: true,
  });
  const nameInputRef = useRef();
  const streetInputRef = useRef();
  const cityInputRef = useRef();
  const postalInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredStreet = streetInputRef.current.value;
    const enteredCity = cityInputRef.current.value;
    const enteredPostal = postalInputRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredPostalIsValid = isFiveChars(enteredPostal);

    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      city: enteredCityIsValid,
      postalCode: enteredPostalIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredCityIsValid &&
      enteredPostalIsValid;

    if (!formIsValid) {
      return;
    }

    props.onConfirm({
      name: enteredName,
      street: enteredStreet,
      city: enteredCity,
      postalCode: enteredPostal
    })
  };

  const controlClasses = (formInputfield) => {
    return `${classes.control} ${
      formInputsValidity[formInputfield] ? "" : classes.invalid
    }`;
  };

  return (
    <div>
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={controlClasses("name")}>
          <label htmlFor="name">Your Name</label>
          <input id="name" type="text" ref={nameInputRef} />
          {!formInputsValidity.name && <p>Please enter a valid name!</p>}
        </div>
        <div className={controlClasses("street")}>
          <label htmlFor="street">Street</label>
          <input id="street" type="text" ref={streetInputRef} />
          {!formInputsValidity.street && <p>Please enter a valid street!</p>}
        </div>
        <div className={controlClasses("postalCode")}>
          <label htmlFor="postal">Postal Code</label>
          <input id="postal" type="text" ref={postalInputRef} />
          {!formInputsValidity.postalCode && (
            <p>Please enter a valid postal code(5 characters long)!</p>
          )}
        </div>
        <div className={controlClasses("city")}>
          <label htmlFor="city">City</label>
          <input id="city" type="text" ref={cityInputRef} />
          {!formInputsValidity.city && <p>Please enter a valid city!</p>}
        </div>
        <div className={classes.actions}>
          <button type="button" onClick={props.onCancel}>
            Cancel
          </button>
          <button className={classes.submit}>Confirm</button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
