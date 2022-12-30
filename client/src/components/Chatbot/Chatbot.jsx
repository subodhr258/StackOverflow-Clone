import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatBotSimple from "react-simple-chatbot";
import ChatBotDefault from "./ChatbotDefault";
import ContactUs from "./ContactUs";
import SearchResult from "./SearchResult";

const c = () => {
  return (
    <p>
      <h3>C++ Programming Language</h3>
      C++ is a cross-platform language that can be used to create
      high-performance applications. C++ was developed by Bjarne Stroustrup, as
      an extension to the C language. C++ gives programmers a high level of
      control over system resources and memory. The language was updated 4 major
      times in 2011, 2014, 2017, and 2020 to C++11, C++14, C++17, C++20.
    </p>
  );
};
const js = () => {
  return (
    <p>
      <h3>Javascript Programming Language</h3>
      Javascript is used by programmers across the world to create dynamic and
      interactive web content like applications and browsers. JavaScript is so
      popular that it's the most used programming language in the world, used as
      a client-side programming language by 97.0% of all websites.
    </p>
  );
};
const p = () => {
  return (
    <p>
      <h3>Python Programming Language</h3>
      Python is a computer programming language often used to build websites and
      software, automate tasks, and conduct data analysis. Python is a
      general-purpose language, meaning it can be used to create a variety of
      different programs and isn't specialized for any specific problems.
    </p>
  );
};
const g = () => {
  return (
    <p>
      <h3>Golang Programming Language</h3>
      Golang is useful for carrying out programming for scalable servers and
      large software systems. The Golang programming language was built to fill
      in the gaps of C++ and Java that Google came across while working with its
      servers and distributed systems.
    </p>
  );
};

const Chatbot = () => {
  const User = useSelector((state) => state.currentUserReducer);
  const [isAuth, setIsAuth] = useState(true);
  const defaultStep = [
    {
      id: "login",
      message: "Please login to access the chatbot.",
    },
  ];
  const LoggedInStep = [
    {
      id: "1",
      message: `Hello User, What do you want to do?`,
      trigger: "options",
    },
    {
      id: "options",
      options: [
        { value: 1, label: "Contact Us", trigger: "contactDetails" },
        {
          value: 2,
          label: "I want to type something",
          trigger: "Ask me something",
        },
        {
          value: 3,
          label: "Programming knowledge",
          trigger: "Programming",
        },
      ],
    },
    {
      id: "Programming",
      message: "Select the programming language you want to know about:",
      trigger: "ProgrammingOptions",
    },
    {
      id: "ProgrammingOptions",
      options: [
        { value: 1, label: "C++", trigger: "C++" },
        { value: 2, label: "JavaScript", trigger: "JavaScript" },
        { value: 3, label: "Python", trigger: "Python" },
        { value: 4, label: "Golang", trigger: "Golang" },
      ],
    },
    {
      id: "C++",
      component: c(),
      trigger: "3",
    },
    {
      id: "JavaScript",
      component: js(),
      trigger: "3",
    },
    {
      id: "Python",
      component: p(),
      trigger: "3",
    },
    {
      id: "Golang",
      component: g(),
      trigger: "3",
    },
    {
      id: "Ask me something",
      message: "Go ahead, type something😉",
      trigger: "userInput",
    },
    {
      id: "contactDetails",
      message: "Feel free to contact us",
      trigger: "contactUs",
    },
    {
      id: "contactUs",
      component: <ContactUs />,
      trigger: "3",
    },
    {
      id: "3",
      message:
        "Thanks for chatting with us!! For any other query, please continue...",
      trigger: "options",
    },
    {
      id: "userInput",
      user: true,
      trigger: "API",
    },
    {
      id: "API",
      component: <SearchResult />,
      waitAction: true,
      end: true,
    },
  ];
  // useEffect(() => {
  //   if (User === null && !isAuth) return;
  //   if (User !== null && isAuth) return;

  //   if (User !== null && !isAuth) {
  //     setIsAuth(true);
  //   }
  //   if (User === null && isAuth) {
  //     setIsAuth(false);
  //   }
  // }, [User]);
  return (
    <div>
      {isAuth ? (
        <ChatBotSimple
          steps={LoggedInStep}
          className={"chatbot"}
          floating={true}
          headerTitle={"StackOverflow's Customer Service"}
          enableMobileAutoFocus={true}
        />
      ) : (
        <ChatBotDefault defaultStep={defaultStep} />
      )}
    </div>
  );
};

export default Chatbot;
