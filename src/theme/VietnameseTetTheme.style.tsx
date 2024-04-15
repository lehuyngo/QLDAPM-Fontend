import styled from 'styled-components'

// 2560x1440: XXXXL
// 2048x1152: XXXL
// 1920x1080: XXL
// 1600x900: XL
// 1536x864: L
// 1440x810: M
// 1366x768: S
// 1280x720: XS

const VietnameseTetThemeStyle = styled.div<{ $sh: number }>`
  --ratio-screen-height: ${(props) => 1080 / props.$sh};

  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;

  .background-main {
    z-index: 10;
    width: 100%;
    height: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: top left;
    background-size: cover;
  }

  .set-item {
    z-index: 20;
    width: 100%;
    height: 100%;
    position: absolute;

    .people-bot-left {
      z-index: 30;
      left: 0;
      bottom: 0;
      position: absolute;
      width: calc(590px / var(--ratio-screen-height));
      height: calc(680px / var(--ratio-screen-height));
      background-repeat: no-repeat;
      background-position: top left;
      background-size: cover;

      .people {
        z-index: 40;
        left: 0;
        bottom: 0;
        position: absolute;
        width: calc(390px / var(--ratio-screen-height));
        height: calc(600px / var(--ratio-screen-height));
        .people-body {
          z-index: 50;
          left: 0;
          bottom: 0;
          position: absolute;
          width: calc(390px / var(--ratio-screen-height));
          height: calc(378.5px / var(--ratio-screen-height));
          background-repeat: no-repeat;
          background-position: top left;
          background-size: cover;

          .body-hand {
            z-index: 55;
            left: calc(116px / var(--ratio-screen-height));
            top: calc(54px / var(--ratio-screen-height));
            position: absolute;
            width: calc(150px / var(--ratio-screen-height));
            height: calc(150px / var(--ratio-screen-height));
            background-repeat: no-repeat;
            background-position: top left;
            background-size: cover;
            animation: rotate-hand-woman 1.2s infinite;

            @keyframes rotate-hand-woman {
              0% {
                transform: rotate(0deg);
                top: calc(54px / var(--ratio-screen-height));
              }
              50% {
                transform: rotate(-4deg);
                top: calc(56px / var(--ratio-screen-height));
              }
              100% {
                transform: rotate(0deg);
                top: calc(54px / var(--ratio-screen-height));
              }
            }
          }
        }

        .people-head {
          z-index: 60;
          left: calc(48.2px / var(--ratio-screen-height));
          top: calc(10px / var(--ratio-screen-height));
          position: absolute;
          width: calc(251.47px / var(--ratio-screen-height));
          height: calc(228.86px / var(--ratio-screen-height));
          background-repeat: no-repeat;
          background-position: top left;
          background-size: cover;
          animation: rotate-head-woman 1.2s infinite;

          @keyframes rotate-head-woman {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(-4deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
        }
      }

      .flower-left {
        z-index: 32;
        left: calc(20px / var(--ratio-screen-height));
        top: calc(320px / var(--ratio-screen-height));
        position: absolute;
        width: calc(48px / var(--ratio-screen-height));
        height: calc(48px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }

      .flower-right {
        z-index: 32;
        left: calc(500px / var(--ratio-screen-height));
        top: calc(230px / var(--ratio-screen-height));
        position: absolute;
        width: calc(56px / var(--ratio-screen-height));
        height: calc(56px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }

      .flower-top-left {
        z-index: 32;
        left: calc(60px / var(--ratio-screen-height));
        top: calc(0px / var(--ratio-screen-height));
        position: absolute;
        width: calc(64px / var(--ratio-screen-height));
        height: calc(64px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }
    }

    .people-bot-right {
      z-index: 30;
      right: 0;
      bottom: 0;
      position: absolute;
      width: calc(590px / var(--ratio-screen-height));
      height: calc(680px / var(--ratio-screen-height));
      background-repeat: no-repeat;
      background-position: top left;
      background-size: cover;

      .people {
        z-index: 40;
        right: 0;
        bottom: 0;
        position: absolute;
        width: calc(390px / var(--ratio-screen-height));
        height: calc(600px / var(--ratio-screen-height));

        .people-body {
          z-index: 50;
          right: 0;
          bottom: 0;
          position: absolute;
          width: calc(390px / var(--ratio-screen-height));
          height: calc(373px / var(--ratio-screen-height));
          background-repeat: no-repeat;
          background-position: top left;
          background-size: cover;

          .body-hand {
            z-index: 55;
            left: calc(136px / var(--ratio-screen-height));
            top: calc(48px / var(--ratio-screen-height));
            position: absolute;
            width: calc(120px / var(--ratio-screen-height));
            height: calc(150px / var(--ratio-screen-height));
            background-repeat: no-repeat;
            background-position: top left;
            background-size: cover;
            animation: rotate-hand-man 1.2s infinite;

            @keyframes rotate-hand-man {
              0% {
                transform: rotate(0deg);
                top: calc(48px / var(--ratio-screen-height));
              }
              50% {
                transform: rotate(4deg);
                top: calc(50px / var(--ratio-screen-height));
              }
              100% {
                transform: rotate(0deg);
                top: calc(48px / var(--ratio-screen-height));
              }
            }
          }
        }

        .people-head {
          z-index: 60;
          left: calc(92px / var(--ratio-screen-height));
          top: calc(5px / var(--ratio-screen-height));
          position: absolute;
          width: calc(251.2px / var(--ratio-screen-height));
          height: calc(235.23px / var(--ratio-screen-height));
          background-repeat: no-repeat;
          background-position: top left;
          background-size: cover;

          animation: rotate-head-man 1.2s infinite;

          @keyframes rotate-head-man {
            0% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(4deg);
            }
            100% {
              transform: rotate(0deg);
            }
          }
        }
      }

      .flower-left {
        z-index: 32;
        left: calc(34px / var(--ratio-screen-height));
        top: calc(230px / var(--ratio-screen-height));
        position: absolute;
        width: calc(56px / var(--ratio-screen-height));
        height: calc(56px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }

      .flower-right {
        z-index: 32;
        left: calc(522px / var(--ratio-screen-height));
        top: calc(320px / var(--ratio-screen-height));
        position: absolute;
        width: calc(48px / var(--ratio-screen-height));
        height: calc(48px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }

      .flower-top-right {
        z-index: 32;
        left: calc(466px / var(--ratio-screen-height));
        top: calc(0px / var(--ratio-screen-height));
        position: absolute;
        width: calc(64px / var(--ratio-screen-height));
        height: calc(64px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }
    }

    .food-center {
      z-index: 70;
      left: 50%;
      bottom: calc(-70px / var(--ratio-screen-height));
      transform: translateX(-50%);
      position: absolute;
      width: calc(1320px / var(--ratio-screen-height));
      height: calc(360px / var(--ratio-screen-height));
      background-repeat: no-repeat;
      background-position: top left;
      background-size: cover;
    }

    .title-dragon {
      z-index: 80;
      left: 50%;
      top: calc(50px / var(--ratio-screen-height));
      transform: translateX(-50%);
      position: absolute;
      width: calc(225px / var(--ratio-screen-height));
      height: calc(150px / var(--ratio-screen-height));

      .cloud-small {
        z-index: 82;
        left: calc(11px / var(--ratio-screen-height));
        top: calc(65px / var(--ratio-screen-height));
        position: absolute;
        width: calc(41.45px / var(--ratio-screen-height));
        height: calc(25.99px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-cloud-small 1.5s infinite;

        @keyframes rotate-cloud-small {
          0% {
            left: calc(11px / var(--ratio-screen-height));
            top: calc(65px / var(--ratio-screen-height));
          }

          50% {
            left: calc(6px / var(--ratio-screen-height));
            top: calc(60px / var(--ratio-screen-height));
          }

          100% {
            left: calc(11px / var(--ratio-screen-height));
            top: calc(65px / var(--ratio-screen-height));
          }
        }
      }

      .cloud-big {
        z-index: 82;
        left: calc(105px / var(--ratio-screen-height));
        top: calc(0px / var(--ratio-screen-height));
        position: absolute;
        width: calc(92.24px / var(--ratio-screen-height));
        height: calc(40.2px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-cloud-big 1.5s infinite;

        @keyframes rotate-cloud-big {
          0% {
            left: calc(105px / var(--ratio-screen-height));
            top: calc(0px / var(--ratio-screen-height));
          }

          50% {
            left: calc(110px / var(--ratio-screen-height));
            top: calc(-5px / var(--ratio-screen-height));
          }

          100% {
            left: calc(105px / var(--ratio-screen-height));
            top: calc(0px / var(--ratio-screen-height));
          }
        }
      }

      .dragon {
        z-index: 82;
        left: 0;
        top: 0;
        position: absolute;
        width: calc(129.92px / var(--ratio-screen-height));
        height: calc(148.57px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-dragon 1.5s infinite;

        @keyframes rotate-dragon {
          0% {
            left: 0;
            top: 0;
          }

          50% {
            left: calc(-5px / var(--ratio-screen-height));
            top: calc(-5px / var(--ratio-screen-height));
          }

          100% {
            left: 0;
            top: 0;
          }
        }
      }

      .number-zero {
        z-index: 82;
        left: calc(120px / var(--ratio-screen-height));
        top: calc(34px / var(--ratio-screen-height));
        position: absolute;
        width: calc(79.27px / var(--ratio-screen-height));
        height: calc(58.65px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-number-zero 1.5s infinite;

        @keyframes rotate-number-zero {
          0% {
            left: calc(120px / var(--ratio-screen-height));
            top: calc(34px / var(--ratio-screen-height));
          }

          50% {
            left: calc(125px / var(--ratio-screen-height));
            top: calc(29px / var(--ratio-screen-height));
          }

          100% {
            left: calc(120px / var(--ratio-screen-height));
            top: calc(34px / var(--ratio-screen-height));
          }
        }
      }

      .number-two {
        z-index: 82;
        left: calc(75px / var(--ratio-screen-height));
        top: calc(85px / var(--ratio-screen-height));
        position: absolute;
        width: calc(70.37px / var(--ratio-screen-height));
        height: calc(58.04px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-number-two 1.5s infinite;

        @keyframes rotate-number-two {
          0% {
            left: calc(75px / var(--ratio-screen-height));
            top: calc(85px / var(--ratio-screen-height));
          }

          50% {
            left: calc(80px / var(--ratio-screen-height));
            top: calc(90px / var(--ratio-screen-height));
          }

          100% {
            left: calc(75px / var(--ratio-screen-height));
            top: calc(85px / var(--ratio-screen-height));
          }
        }
      }

      .number-four {
        z-index: 82;
        left: calc(130px / var(--ratio-screen-height));
        top: calc(85px / var(--ratio-screen-height));
        position: absolute;
        width: calc(74.81px / var(--ratio-screen-height));
        height: calc(58.31px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-number-four 1.5s infinite;

        @keyframes rotate-number-four {
          0% {
            left: calc(130px / var(--ratio-screen-height));
            top: calc(85px / var(--ratio-screen-height));
          }

          50% {
            left: calc(135px / var(--ratio-screen-height));
            top: calc(90px / var(--ratio-screen-height));
          }

          100% {
            left: calc(130px / var(--ratio-screen-height));
            top: calc(85px / var(--ratio-screen-height));
          }
        }
      }
    }

    .tree-top-left {
      z-index: 90;
      left: calc(-80px / var(--ratio-screen-height));
      top: 0;
      position: absolute;
      width: calc(969.45px / var(--ratio-screen-height));
      height: calc(753.42px / var(--ratio-screen-height));

      .board-text {
        z-index: 92;
        left: calc(384px / var(--ratio-screen-height));
        top: calc(205px / var(--ratio-screen-height));
        position: absolute;
        width: calc(165px / var(--ratio-screen-height));
        height: calc(551.42px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-board-text-left 1.5s infinite;

        @keyframes rotate-board-text-left {
          0% {
            transform: rotate(0deg);
            top: calc(205px / var(--ratio-screen-height));
          }
          50% {
            transform: rotate(-1deg);
            top: calc(210px / var(--ratio-screen-height));
          }
          100% {
            transform: rotate(0deg);
            top: calc(205px / var(--ratio-screen-height));
          }
        }
      }

      .lampion {
        z-index: 92;
        left: calc(170px / var(--ratio-screen-height));
        top: calc(178px / var(--ratio-screen-height));
        position: absolute;
        width: calc(110px / var(--ratio-screen-height));
        height: calc(250px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;

        animation: rotate-lampion-left 1.5s infinite;

        @keyframes rotate-lampion-left {
          0% {
            transform: rotate(0deg);
            top: calc(178px / var(--ratio-screen-height));
          }
          50% {
            transform: rotate(-1deg);
            top: calc(174px / var(--ratio-screen-height));
          }
          100% {
            transform: rotate(0deg);
            top: calc(178px / var(--ratio-screen-height));
          }
        }
      }

      .tree {
        z-index: 94;
        left: 0;
        top: 0;
        position: absolute;
        width: calc(969.45px / var(--ratio-screen-height));
        height: calc(753.42px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }
    }

    .tree-top-right {
      z-index: 90;
      right: calc(-80px / var(--ratio-screen-height));
      top: 0;
      position: absolute;
      width: calc(969.45px / var(--ratio-screen-height));
      height: calc(756.42px / var(--ratio-screen-height));

      .board-text {
        z-index: 92;
        left: calc(419.45px / var(--ratio-screen-height));
        top: calc(205px / var(--ratio-screen-height));
        position: absolute;
        width: calc(165px / var(--ratio-screen-height));
        height: calc(551.42px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        animation: rotate-board-text-right 1.5s infinite;

        @keyframes rotate-board-text-right {
          0% {
            transform: rotate(0deg);
            top: calc(205px / var(--ratio-screen-height));
          }
          50% {
            transform: rotate(1deg);
            top: calc(210px / var(--ratio-screen-height));
          }
          100% {
            transform: rotate(0deg);
            top: calc(205px / var(--ratio-screen-height));
          }
        }
      }

      .lampion {
        z-index: 92;
        left: calc(689.45px / var(--ratio-screen-height));
        top: calc(178px / var(--ratio-screen-height));
        position: absolute;
        width: calc(110px / var(--ratio-screen-height));
        height: calc(250px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;

        animation: rotate-lampion-right 1.5s infinite;

        @keyframes rotate-lampion-right {
          0% {
            transform: rotate(0deg);
            top: calc(178px / var(--ratio-screen-height));
          }
          50% {
            transform: rotate(1deg);
            top: calc(174px / var(--ratio-screen-height));
          }
          100% {
            transform: rotate(0deg);
            top: calc(178px / var(--ratio-screen-height));
          }
        }
      }

      .tree {
        z-index: 94;
        right: 0;
        top: 0;
        position: absolute;
        width: calc(969.45px / var(--ratio-screen-height));
        height: calc(756.42px / var(--ratio-screen-height));
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
      }
    }
  }

  &.page-login .form {
    z-index: 100;
    position: relative;
    width: 360px;
    height: 350px;
    /* height: calc(350px - 14px * 22 / 14); */
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fbeac7;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.45) 1px 1px 40px 0px;
  }

  &.page-register .form {
    z-index: 100;
    position: relative;
    width: 520px;
    height: 490px;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -60%);
    background-color: #fbeac7;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.45) 1px 1px 40px 0px;
  }

  @media only screen and (min-width: 1366px) {
  }

  @media only screen and (min-width: 1440px) {
  }

  @media only screen and (min-width: 1536px) {
  }

  @media only screen and (min-width: 1920px) {
    &.page-login .form {
      width: 440px;
      height: 400px;
      /* height: calc(400px - 16px * 22 / 14); */
    }

    &.page-register .form {
      width: 560px;
      height: 560px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  @media only screen and (min-width: 2048px) {
    &.page-login .form {
      width: 460px;
      height: 440px;
      /* height: calc(440px - 18px * 22 / 14); */
    }

    &.page-register .form {
      width: 640px;
      height: 640px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  @media only screen and (min-width: 2560px) {
    &.page-login .form {
      width: 560px;
      height: 520px;
      height: 520px;
      /* height: calc(520px - 20px * 22 / 14); */
    }

    &.page-register .form {
      width: 700px;
      height: 740px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
`

export { VietnameseTetThemeStyle }
