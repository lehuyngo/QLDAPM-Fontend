import styled from 'styled-components'

const SettingPointToolbarStyle = styled.div`
  display: flex;
  gap: 12px;
  padding: 0px 12px 12px;

  .filter-range .ant-picker {
    background-color: #fff !important;
    border-radius: 8px;
    border: 1px solid #e4e4e6;
    height: 40px;

    .ant-picker-input input {
      font-size: 14px !important;
    }
  }

  .btn-setting-point {
    font-size: 14px;
    line-height: 16px;
    font-weight: 700;
    color: #fff !important;
    background-color: #fc7634 !important;
    border: none;
    display: flex;
    align-items: center;
    height: 40px;
  }
`

const PointTableToolbarStyle = styled.div`
  display: flex;
  gap: 12px;
  margin: 0 0 12px;

  .btn-search {
    width: 280px;
    height: 40px;
  }

  .btn-sort {
    height: 40px;
    width: 180px;
  }
`

const PointListStyle = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
`

const PointItemStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #e4e4e6;
  max-width: 100%;
  max-height: 14rem;
  align-items: center;
  cursor: pointer;

  .avatar {
    display: flex;
    justify-content: center;
    img {
      height: 5rem;
      width: 5rem;
      border-radius: 50rem;
    }
  }
  .name {
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }

  .email {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }
  .point {
    color: #ffc700;
    display: flex;
    align-items: center;
    gap: 4px;

    .icon {
      font-size: 16px;
      display: flex;
      align-items: center;
      svg {
        fill: currentColor;
        border: 1px solid;
        padding: 2px;
        border-radius: 50rem;
      }
    }

    .label {
      font-size: 16px;
      line-height: 18px;
      font-weight: 700;
    }
  }
`

const SettingPointFormStyle = styled.div`
  --background-color-item: #f4f4f4;

  display: flex;
  flex-direction: column;
  gap: 10px;
  .label-list {
    font-size: 16px;
    font-weight: 700;
    line-height: 18px;
    display: flex;
    gap: 8px;

    .activity {
      width: 70%;
    }
    .space {
      width: 5%;
    }
    .point {
      width: 25%;
    }
  }
  .point-list-exist {
    margin-bottom: 10px;
    .point-item {
      display: flex;
      gap: 8px;
      width: 100%;
      .label-container {
        background-color: var(--background-color-item);
        width: 70%;
        .label {
          height: 44px;
          padding: 8px 12px;
          font-size: 14px;
          display: flex;
          align-items: center;
        }
      }

      .equal-symbol {
        width: 5%;
        font-size: 14px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .point {
        width: 25%;
        gap: 4px;
        background-color: var(--background-color-item);
        border-radius: 8px;
        padding: 8px 12px;
        height: 44px;
        display: flex;
        align-items: center;

        .value {
          flex: 1;
          font-size: 14px;
        }

        .unit {
          font-size: 12px;
        }
      }
    }

    .point-item-first {
      .label-container {
        border-radius: 8px 8px 0 0;
        padding-bottom: 10px;
      }
      .point {
        margin-bottom: 10px;
      }
    }

    .point-item-middle {
      .label-container {
        padding-bottom: 10px;
      }
      .point {
        margin-bottom: 10px;
      }
    }

    .point-item-last {
      .label-container {
        border-radius: 0 0 8px 8px;
      }
    }

    .point-item-unique {
      .label-container {
        border-radius: 8px 8px 8px 8px;
      }
    }
  }

  form {
    .field-add-activities {
      margin-bottom: 0px;

      .field-add-activities--btn {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        justify-content: center;
        border-style: solid;
        border-color: #fc7634;

        span {
          font-size: 14px;
          line-height: 14px;
        }

        &:hover {
          border-color: #fc7634 !important;
          background-color: #fc7634;
          color: #f4f4f4 !important;
        }
      }
    }

    .point-item-new {
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      gap: 8px;
      position: relative;

      .ant-form-item {
        margin-bottom: 0px;
      }

      .label {
        width: 70%;
      }

      .equal-symbol {
        width: 5%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        height: 44px;
      }

      .point-field-container {
        width: 25%;

        .ant-input {
          padding-right: 28px;
        }
      }

      .btn-delete {
        position: absolute;
        right: 8px;
        top: 22px;
        transform: translateY(-50%);
        display: flex;

        opacity: 0.5;

        &:hover {
          opacity: 1;
        }

        svg {
          font-size: 18px;
          padding: 2px;
          cursor: pointer;
        }
      }
    }
  }
`

export {
  SettingPointToolbarStyle,
  PointTableToolbarStyle,
  PointListStyle,
  PointItemStyle,
  SettingPointFormStyle
}
