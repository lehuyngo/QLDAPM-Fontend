import styled from 'styled-components'

const ModalTimezoneContent = styled.div`
  padding: 0.8rem 0;
`

const ModalTimezoneOptions = styled.div<{
  $isSelected: boolean
}>`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.5rem;
  background-color: #fff;
  cursor: pointer;
  border-radius: 0.2rem;
  border: 1px solid #d1d5db;
  margin: 0.4rem 0;
  background: ${(props) => (props.$isSelected ? '#60a5fa' : '#fff')};
`

const FlagIcon = styled.div<{
  $src: any
}>`
  height: 1rem;
  width: 1.2rem;
  border: 1px solid #d1d5db;

  background-image: url(${(props) => props.$src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`

const PopoverTimezoneStyle = styled.div`
  width: max-content;

  .options {
    background-color: #fff;

    .config-option {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem;
      cursor: pointer;

      &:hover {
        background-color: #d1d5db;
      }

      .icon {
        height: 1rem;
        width: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .expand {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: end;
      }
    }
  }

  @media only screen and (min-width: 1920px) {
    &.popup-tz-auth-btn-timezone {
      .config-option {
        gap: 6px;
        font-size: 16px;
        .flag-icon-opt {
          height: 20px;
          width: 24px;
        }
      }
    }
  }

  @media only screen and (min-width: 2048px) {
    &.popup-tz-auth-btn-timezone {
      .config-option {
        gap: 8px;
        font-size: 18px;
        .flag-icon-opt {
          height: 22px;
          width: 26.4px;
        }
      }
    }
  }

  @media only screen and (min-width: 2560px) {
    &.popup-tz-auth-btn-timezone {
      .config-option {
        gap: 10px;
        font-size: 20px;
        .flag-icon-opt {
          height: 24px;
          width: 28.8px;
        }
      }
    }
  }
`

const TimezoneStyle = styled.div<{ $theme: any }>`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid;
  border-radius: 50rem;
  height: 1.6rem;
  padding: 4px 16px;
  cursor: pointer;
  background-color: ${(props) =>
    props.$theme?.name === 'theme-season'
      ? props.$theme?.backgroundColor
      : '#fff'};

  border-color: ${(props) =>
    props.$theme?.name === 'theme-season' ? props.$theme?.mainColor : '#999'};
  color: ${(props) =>
    props.$theme?.name === 'theme-season'
      ? props.$theme?.mainColor
      : 'inherit'};

  &:hover {
    background-color: #f4f4f4;
  }

  .timezone-picked {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .change-time-zone-text {
    display: none;

    @media only screen and (min-width: 1024px) {
      display: block;
    }
  }

  &.auth-btn-timezone {
    border-radius: 6px;
    width: 100%;
    padding: 4px 12px;
    display: flex;
    justify-content: center;
    height: 32px;

    @media only screen and (min-width: 1920px) {
      & {
        font-size: 16px;
        height: 36px;

        .timezone-picked {
          gap: 6px;
          .flag-icon-opt {
            height: 20px;
            width: 24px;
          }
        }
      }
    }

    @media only screen and (min-width: 2048px) {
      & {
        height: 40px;
        font-size: 18px;

        .timezone-picked {
          gap: 8px;
          .flag-icon-opt {
            height: 22px;
            width: 26.4px;
          }
        }
      }
    }

    @media only screen and (min-width: 2560px) {
      & {
        height: 48px;
        font-size: 20px;

        .timezone-picked {
          gap: 10px;
          .flag-icon-opt {
            height: 24px;
            width: 28.8px;
          }
        }
      }
    }
  }
`

export {
  ModalTimezoneContent,
  ModalTimezoneOptions,
  FlagIcon,
  PopoverTimezoneStyle,
  TimezoneStyle
}
