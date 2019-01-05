import { createGlobalStyle } from "styled-components";

const variables = {
  black: "#303030",
  width: "800px",
  purple: "#262161",
  yellow: "#FFC40E",
  pink: "#EE7297",
  green: "#93FF00",
  grey: "rgb(211,211,211)",
  red: "#E50714",
  shad: "0 0 10px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)",
  grad:
    "linear-gradient(90deg, #48ded4 0%, #a026bf 20%, #e82c75 60%, $yellow 85%, #48ded4 95%)",
  verticalGrad:
    "linear-gradient(0, #48ded4 0%, #a026bf 20%, #e82c75 60%, #FFC40E 85%, #48ded4 95%)"
};

const GlobalStyle = createGlobalStyle`

@font-face {
    font-family: 'panama';
    src: url('/fonts/panama-bold-webfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

html {
  font-size:10px;
}

body {
  font-size:1.5rem;
  color:${variables.black};
}

h1, h2, h3, h4, h5, h6 {
  font-size: 5rem;
  font-family: 'panama';
  font-weight: 600;
  letter-spacing:-1px;
}

a {
  text-decoration: none;
  color:${variables.black};
}

p a {
  border-bottom: 2px solid ${variables.yellow};
}

p {
  line-height: 2;
  font-size: 1.6rem;
}
.top {
  height: 1rem;
  background: linear-gradient(
            90deg,
            #48ded4 0%,
            #a026bf 20%,
            #e82c75 60%,
            #ffc40e 85%,
            #48ded4 95%
          )
          fixed;
}
.title {
  word-wrap: break-word;
  position: relative;
  z-index: 2;
  margin:0;
  font-size: 40px;
  z-index: 2;
  line-height:1.1;
  transform: skew(0, -3deg);
  &--long {
    font-size: 30px;
  }
  &:before {
    content: '';
    width:50px;
    left:0;
    top:0;
    height:100%;
    top:10%;
    display: block;
    position: absolute;
    z-index: -1;
    transform:skew(-5deg)
  }
  line-height:1.1;
  a {
    border-bottom: 0;
    background-image: linear-gradient(rgba(255,196,14,0.8) 100%, rgba(255,196,14,0.8) 50%);
  }
}

.title--single {
  max-width: 600px;
  margin-top: -9rem;
  font-size: 10rem;
  text-align: center;
  @media all and (max-width: 850px) {
      font-size: 7rem;
    }
}

.hide {
  text-indent: -999999px;
  font-size: 0;
}

.button {
  border: 0;
  background: ${variables.yellow};
  color: ${variables.black};
  font-family: 'Panama';
  font-weight: 600;
}

.avatar {
 min-width: 50px;
 height: 50px;
 border-radius: 50%;
 align-self: center;
}

.card {
  background: white;
  padding: 5rem;
  box-shadow: 0 1px 10px rgba(0,0,0,0.15);
}



.main {
}

.inner {
  max-width:900px;
  margin: 0 auto;
  @media all and (max-width: 900px) {
    padding: 2rem;
  }
}
.stores {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

  .store {
    background: white;
    margin: 10px 0;
    width: 30%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05);
    &--wide {
      width: 100%;
    }
    &__details {
      padding: 2rem;
      p {
        line-height: 1.2;
        margin-bottom: 0;
      }
    }
    @media all and (max-width: 850px) {
      width: 48%;
    }
    @media all and (max-width: 550px) {
      width: 100%;
    }
  }

  .store__actions {
    position: relative;
    z-index: 2;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.2);
    margin-bottom: 50px;
    padding-top: 10px;
    padding-bottom: 20px;
    display: flex;
    color: white;
    align-items: center;
    justify-content: space-around;
  }

  .store__action {
    font-size: 10px;
    svg {
      width: 25px;
      fill: white;
    }
    &--edit {
      a {
        border-bottom: 0;
      }
    }
  }

  .store__hero {
    position: relative;
    padding: 0 10px 0 10px;
    text-align: right;
    &:before {
      display: block;
      content: "";
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      right: 0;
      background: linear-gradient(
          45deg,
          hsla(190, 95%, 43%, 1) 0%,
          hsla(190, 95%, 43%, 0) 70%
        ),
        linear-gradient(
          135deg,
          hsla(219, 93%, 48%, 1) 10%,
          hsla(219, 93%, 48%, 0) 80%
        ),
        linear-gradient(
          225deg,
          hsla(293, 93%, 48%, 1) 10%,
          hsla(293, 93%, 48%, 0) 80%
        ),
        linear-gradient(
          315deg,
          hsla(130, 96%, 45%, 1) 100%,
          hsla(130, 96%, 45%, 0) 70%
        );
      opacity: 0.6;
      z-index: 1;
      clip-path: polygon(0 0, 100% 0, 100% 90%, 0% 100%);
    }
    img {
      height: 100%;
      width: 100%;
      top: 0;
      right: 0;
      position: absolute;
      left: 0;
      object-fit: cover;
      clip-path: polygon(0 0, 100% 0, 100% 90%, 0% 100%);
    }
  }


.heart {
  &__button {
    background: none;
    border: 0;
    outline: 0;
    position: relative;
    svg {
      width: 25px;
      fill: white;
    }
    &--hearted {
      svg {
        fill: red;
      }
    }

    & :hover {
      cursor: pointer
    }
  }
}


.tags {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tag {
  display: block;
  margin-right: 1rem;
  margin-top: 1rem;
  &__choice {
    display: flex;
    justify-content: center;
    align-items: center;
    input {
      width: auto;
      right: -1.5rem;
      margin-right: -1rem;
      position: relative;
      z-index: 2;
      & + label {
        background: ${variables.grey};
        padding: 1rem 1rem 1rem 4rem;
      }
      &:checked + label {
        background: ${variables.yellow};
      }
    }
  }
  &__link {
    background:${variables.yellow};
    color:${variables.black};
    display: flex;
    padding-left: 10px;
    clip-path: polygon(10px 0%, 100% 1%, 100% 100%, 10px 100%, 0% 50%);
    &--active {
      background: #963cc1;
      .tag__text {
        color: white;
      }
    }
  }
  &__text {
    padding: 1rem 1rem;
    display: block;
  }
  &__count {
    padding: 1rem 1rem;
    background: white;
    border-left: 3px solid rgba(0,0,0,0.1);
    margin-right: -1px;
    background-clip: padding-box;
  }
}

.map {
  padding: 20px;
  background: white;
  box-shadow: ${variables.shad};
}
#map {
  height: 500px;
}

.popup {
  width: 300px;
  img {
    width: 100%;
  }
}

.autocomplete__input {
  width: 100%;
  height: 4rem;
  padding: 2px;
}


`;

export default GlobalStyle;
