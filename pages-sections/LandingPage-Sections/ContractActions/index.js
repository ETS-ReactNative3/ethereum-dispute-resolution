import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// Kit Components
import Button from "./node_modules/components/CustomButtons/Button.js.js";
import Card from "./node_modules/components/Card/Card.js.js";
import CardBody from "./node_modules/components/Card/CardBody.js.js";
import CardHeader from "./node_modules/components/Card/CardHeader.js.js";
import CardFooter from "./node_modules/components/Card/CardFooter.js.js";
import CustomInput from "./node_modules/components/CustomInput/CustomInput.js.js";
import Grid from "@material-ui/core/Grid";

// Sections
import AwaitingPayment from "./node_modules/pages-sections/Demo/ContractActions/AwaitingPayment.js.js";
import AwaitingProductSent from "./node_modules/pages-sections/Demo/ContractActions/AwaitingProductSent.js.js";
import AwaitingDelivery from "./node_modules/pages-sections/Demo/ContractActions/AwaitingDelivery.js.js";

// Contract Config
import {
  EscrowState,
  EscrowSteps,
  DisputeState,
  DisputeSteps,
} from "./node_modules/components/config/contract.js.js";

// Styles
import styles from "./node_modules/assets/jss/sections/ContractActions.js.js";
const useStyles = makeStyles(styles);

const ContractActions = ({
  activeEscrowState,
  activeDisputeStep,
  dispatchAction,
  ...rest
}) => {
  const classes = useStyles({ ...rest });
  const escrowStep = EscrowSteps[EscrowState[activeEscrowState]];

  return (
    <Grid container>
      <Grid item xs={12} sm={6} md={4}>
        <div>
          <h3>{escrowStep.name}</h3>
          {escrowStep.description}
          {activeEscrowState === 5 && (
            <Button
              primary
              color="primary"
              size="lg"
              block={true}
              onClick={() => dispatchAction("reset", "")}
            >
              Click to reset contract
            </Button>
          )}
        </div>
      </Grid>
      {activeEscrowState === 0 && (
        <AwaitingPayment classes={classes} dispatchAction={dispatchAction} />
      )}
      {activeEscrowState === 1 && (
        <AwaitingProductSent
          classes={classes}
          dispatchAction={dispatchAction}
        />
      )}
      {activeEscrowState === 2 && (
        <AwaitingDelivery classes={classes} dispatchAction={dispatchAction} />
      )}
    </Grid>
  );
};

export default ContractActions;
