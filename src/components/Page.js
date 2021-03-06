import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import Column from "./Column";
import Property from "./Property";

class Page extends React.Component {
  constructor(props) {
    super(props);

    const saved = props.propertyData.saved;
    this.state = {
      savedIds: saved.map(propertyObject => propertyObject.id)
    };
  }

  state = {
    savedIds: []
  };

  allProperties = () => {
    const results = this.props.propertyData.results;
    const saved = this.props.propertyData.saved;

    return results.concat(saved);
  };

  savedPropertiesFromState = properties =>
    this.state.savedIds.map(id => properties.find(p => p.id === id));

  addToSaved = propertyId => {
    this.setState({
      savedIds: Array.from(new Set([...this.state.savedIds, propertyId]))
    });
  };

  removeFromSaved = propertyId => {
    this.setState({
      savedIds: this.state.savedIds.filter(id => id !== propertyId)
    });
  };

  constructPropertiesFromResults = () => {
    const results = this.props.propertyData.results;
    return results.map(property =>
      this.constructPropertiesFromResult(property)
    );
  };

  constructPropertiesFromResult = property => {
    const isSaved = this.state.savedIds.includes(property.id);

    return isSaved
      ? this.constructProperty({
          property,
          buttonText: "Added",
          buttonDisabled: true
        })
      : this.constructProperty({
          property,
          buttonText: "Add property",
          buttonAction: this.addToSaved
        });
  };

  constructPropertiesFromSaved = () => {
    const all = this.allProperties();
    return this.savedPropertiesFromState(all).map(property =>
      this.constructProperty({
        property,
        buttonText: "Remove property",
        buttonAction: this.removeFromSaved
      })
    );
  };

  constructProperty = ({
    property,
    buttonText,
    buttonAction = () => {},
    buttonDisabled = false
  }) => (
    <Property
      key={property.id}
      property={property}
      buttonText={buttonText}
      buttonAction={buttonAction}
      buttonDisabled={buttonDisabled}
    />
  );

  render() {
    const results = this.constructPropertiesFromResults();
    const saved = this.constructPropertiesFromSaved();

    return (
      <Grid columns={2} container divided stackable>
        <Grid.Row>
          <Column properties={results} />
          <Column properties={saved} />
        </Grid.Row>
      </Grid>
    );
  }
}

Page.propTypes = {
  propertyData: PropTypes.shape({
    results: PropTypes.array.isRequired,
    saved: PropTypes.array.isRequired
  }).isRequired
};

export default Page;
