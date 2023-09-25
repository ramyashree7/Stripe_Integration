import React, { useState, useEffect } from "react";
import "../App.scss";
import axios from "axios";
import { toast } from "react-toastify";
import "./Home.css";
import Iframe from "react-iframe";
import Modal from "react-modal";
import "./Form.css";
import "react-toastify/dist/ReactToastify.css";
import config from "../config.json";
import { useNavigate } from "react-router-dom";
const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
  const month = i + 1;
  return month <= 9 ? "0" + month : String(month);
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);
const CForm = ({
  cardMonth,
  cardYear,
  onUpdateState,
  cardNumberRef,
  cardHolderRef,
  cardCvvRef,
  cardDateRef,
  onCardInputFocus,
  onCardInputBlur,
  cardCvv,
  children,
  cardHolder,
}) => {
  const url = config.url;
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [cardNumberError, setCardNumberError] = useState("");
  const [cardHolderError, setCardHolderError] = useState("");
  const [cardCvvError, setCardCvvError] = useState("");
  const [cardYearError, setCardYearError] = useState("");
  const [cardMonthError, setCardMonthError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentId, setPaymentId] = useState(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
  });
  const openModal = () => {
    if (
      cardHolder.trim() &&
      cardNumber.trim() &&
      cardMonth.trim() &&
      cardYear.trim() &&
      cardCvv.trim()
    ) {
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const cardHolder = value;
    if (name === "cardHolder") {
      if (value.trim() === "") {
        setCardHolderError("Card holder name is required.");
      } else if (value.length < 3) {
        setCardHolderError("Card holder name should be at least 3 characters.");
      } else if (value.length > 50) {
        setCardHolderError("Card holder name is too long.");
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        setCardHolderError("Card holder name should contain only alphabets.");
      } else {
        setCardHolderError("");
      }
    }
    onUpdateState(name, cardHolder);
  };

  const onCardCvvChange = (event) => {
    const { value, name } = event.target;
    const cardCvv = value;
    if (name === "cardCvv") {
      if (/^\d{3}$/.test(value)) {
        setCardCvvError("");
      } else {
        setCardCvvError("Cvv is invalid.");
      }
    }
    onUpdateState(name, cardCvv);
  };

  const onCardYearChange = (event) => {
    const { value, name } = event.target;
    const cardYear = value;
    if (/^\d{4}$/.test(value)) {
      setCardYearError("");
    } else {
      setCardYearError("Year is invalid.");
    }
    onUpdateState(name, cardYear);
  };

  const onCardMonthChange = (event) => {
    const { value, name } = event.target;
    const cardMonth = value;
    if (/^\d{1,2}$/.test(value) && value >= 1 && value <= 12) {
      setCardMonthError("");
    } else {
      setCardMonthError("Month is invalid.");
    }
    onUpdateState(name, cardMonth);
  };

  const onCardNumberChange = (event) => {
    let { value, name } = event.target;
    let cardNumber = value;
    value = value.replace(/\D/g, "");
    if (/^\d{13,19}$/.test(value)) {
      cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      setCardNumberError("");
      if (/^62\d{14,17}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      } else if (/^4\d{12,15}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      } else if (/^5[1-5]\d{14}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      } else if (/^6011\d{12}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      } else if (/^3[68]\d{12}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      } else if (/^9792\d{12}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      } else if (/^3[47]\d{0,13}$/.test(value)) {
        cardNumber = value.replace(/\d{4}(?=\d)/g, "$& ");
      }
    } else {
      setCardNumberError("Card number is invalid.");
    }

    setCardNumber(cardNumber.trimRight());
    onUpdateState(name, cardNumber);
  };

  const onCvvFocus = () => {
    onUpdateState("isCardFlipped", true);
  };

  const onCvvBlur = () => {
    onUpdateState("isCardFlipped", false);
  };
  const access_token = localStorage.getItem("access_token");
  const access = {
    headers: {
      auth: access_token,
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formIsValid = true;

    if (!cardHolder || cardHolder.trim() === "") {
      setCardHolderError("Card holder name is required.");

      formIsValid = false;
    } else {
      setCardHolderError("");
    }
    if (cardNumber === "") {
      setCardNumberError("Card number is required.");
      formIsValid = false;
    } else {
      setCardNumberError("");
    }

    if (cardMonth === "") {
      setCardMonthError("Month is required.");
      formIsValid = false;
    } else {
      setCardMonthError("");
    }

    if (cardYear === "") {
      setCardYearError("Year is required.");
      formIsValid = false;
    } else {
      setCardYearError("");
    }

    if (!cardCvv || cardCvv.trim() === "") {
      setCardCvvError("CVV is required.");
      formIsValid = false;
    } else {
      setCardCvvError("");
    }

    if (!formIsValid) {
      toast.error("Please fill in all required fields.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const cardDetails = {
      cardNumber: cardNumber,
      custName: cardHolder,
      expMonth: cardMonth,
      expYear: cardYear,
      cvc: cardCvv,
    };
    console.log(cardDetails);

    try {
      const response = await axios.post(
        `${url}/payment/checkout`,
        cardDetails,
        access
      );
      if (response.status === 200) {
        if (response.data.type === 0) {
          toast.success(response.data.payment_status, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setPaymentUrl(response.data.payment_url);
          setIsModalOpen(true);
        } else if (response.data.type === 1) {
          toast.success(response.data.payment_status, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setPaymentUrl(response.data.payment_url);
          setIsModalOpen(true);
          navigate("/success");
        } else {
          toast.success(response.data.payment_status, {
            position: toast.POSITION.TOP_RIGHT,
          });
          setPaymentUrl(response.data.payment_url);
          setIsModalOpen(true);
          // setPaymentId(response.data.payment_id);
          checkPaymentStatus(response.data.payment_id);
          // console.log(response.data.payment_id);
        }
      }
    } catch (error) {
      toast.error(error.response.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const checkPaymentStatus = async (paymentIdToCheck) => {
    try {
      const response1 = await axios.get(
        `${url}/payment/validate?payment_intent=${paymentIdToCheck}`,
        access
      );
      console.log(paymentIdToCheck);
      console.log(response1);
      if (response1.data === "Payment already successfull") {
        toast.success(response1.data, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => closeModal(), 7000);
      } else {
        toast.info("Payment is still pending", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  return (
    <div className="card-form">
      {!isModalOpen && (
        <div>
          <div className="card-list">{children}</div>
          <div className="card-form__inner">
            <form onSubmit={handleSubmit}>
              <div className="card-input">
                <label htmlFor="cardNumber" className="card-input__label">
                  Card Number
                </label>
                <input
                  type="tel"
                  name="cardNumber"
                  className="card-input__input"
                  autoComplete="off"
                  onChange={onCardNumberChange}
                  maxLength="19"
                  ref={cardNumberRef}
                  onFocus={(e) => onCardInputFocus(e, "cardNumber")}
                  onBlur={onCardInputBlur}
                  value={cardNumber}
                />
                {cardNumberError && (
                  <div
                    className="error-message"
                    style={{ color: "red", fontSize: "14px" }}
                  >
                    {cardNumberError}
                  </div>
                )}
              </div>

              <div className="card-input">
                <label htmlFor="cardName" className="card-input__label">
                  Card Holder
                </label>
                <input
                  type="text"
                  className="card-input__input"
                  autoComplete="off"
                  name="cardHolder"
                  value={cardHolder}
                  onChange={handleChange}
                  ref={cardHolderRef}
                  onFocus={(e) => onCardInputFocus(e, "cardHolder")}
                  onBlur={onCardInputBlur}
                />
                {cardHolderError && (
                  <div
                    className="error-message"
                    style={{ color: "red", fontSize: "14px" }}
                  >
                    {cardHolderError}
                  </div>
                )}
              </div>

              <div className="card-form__row">
                <div className="card-form__col">
                  <div className="card-form__group">
                    <label htmlFor="cardMonth" className="card-input__label">
                      Expiration Date
                    </label>
                    <select
                      className="card-input__input -select"
                      value={cardMonth}
                      name="cardMonth"
                      onChange={onCardMonthChange}
                      ref={cardDateRef}
                      onFocus={(e) => onCardInputFocus(e, "cardDate")}
                      onBlur={onCardInputBlur}
                    >
                      <option value="" disabled>
                        Month
                      </option>

                      {monthsArr.map((val, index) => (
                        <option key={index} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                    <div>
                      {cardMonthError && (
                        <div
                          className="error-messages"
                          style={{
                            color: "red",
                            fontSize: "14px",
                            marginTop: "30px",
                            marginLeft: "-150px",
                            marginBottom: "-20px",
                            width: "180px",
                          }}
                        >
                          {cardMonthError}
                        </div>
                      )}
                    </div>
                    <select
                      name="cardYear"
                      className="card-input__input -select"
                      value={cardYear}
                      onChange={onCardYearChange}
                      onFocus={(e) => onCardInputFocus(e, "cardDate")}
                      onBlur={onCardInputBlur}
                      style={{ width: "100px" }}
                    >
                      <option value="" disabled>
                        Year
                      </option>
                      {yearsArr.map((val, index) => (
                        <option key={index} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                    {cardYearError && (
                      <div
                        className="error-messagess"
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginLeft: "126px",
                          marginTop: "2px",
                          width: "100px",
                        }}
                      >
                        {cardYearError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-form__col -cvv">
                  <div className="card-input">
                    <label htmlFor="cardCvv" className="card-input__label">
                      CVV
                    </label>
                    <input
                      type="password"
                      className="card-input__input"
                      maxLength="3"
                      autoComplete="off"
                      name="cardCvv"
                      value={cardCvv}
                      onChange={onCardCvvChange}
                      onFocus={onCvvFocus}
                      onBlur={onCvvBlur}
                      ref={cardCvvRef}
                    />
                    {cardCvvError && (
                      <div
                        className="error-message"
                        style={{ color: "red", fontSize: "14px" }}
                      >
                        {cardCvvError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-center  py-0 "
                color="#35ca7d"
              >
                <button
                  type="submit"
                  className="mx-3 px-4 py-1 my-2"
                  size="lg"
                  style={{
                    color: "white",
                    borderRadius: "2rem",
                    backgroundColor: " #2079df",
                    border: "1px solid  #2079df",
                  }}
                >
                  PAY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="modalstyle">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Payment Modal"
          className="custom-modal"
          overlayClassName="custom-overlay"
          ariaHideApp={false}
        >
          <h2>Payment Modal</h2>
          <p>Put your payment form or content here...</p>

          <Iframe src={paymentUrl} />
          <div className="modalbutton">
            {/* <button
              className="mx-2 my-2 px-4 py-2"
              size="lg"
              style={{
                color: "white",
                borderRadius: "2rem",
                backgroundColor: " #2079df",
                border: "1px solid  #2079df",
              }}
              onClick={closeModal}
            >
              Close
            </button> */}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CForm;
