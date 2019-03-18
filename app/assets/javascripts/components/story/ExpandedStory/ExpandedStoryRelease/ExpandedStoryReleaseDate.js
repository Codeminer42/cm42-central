import React from 'react';
import ExpandedStorySection from '../ExpandedStorySection';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { editingStoryPropTypesShape } from '../../../../models/beta/story';

class ExpandedStoryReleaseDate extends React.Component {
  constructor(props) {
    super(props);

    const { story } = props;
    moment.locale(I18n.locale);

    const releaseDate = moment(story._editing.releaseDate);

    this.state = {
      releaseDate: releaseDate.isValid() ? releaseDate : null
    }
  }

  render() {
    const { onEdit } = this.props;

    return (
      <ExpandedStorySection
        title={I18n.t('activerecord.attributes.story.release_date')}
      >
        <DatePicker
          locale={I18n.locale}
          placeholderText={
            I18n.t('activerecord.attributes.story.release_date')
          }
          selected={this.state.releaseDate}
          className="form-control input-sm"
          onChange={(releaseDate) =>
            this.setState({ releaseDate }, () =>
              onEdit(releaseDate._d.toLocaleString())
            )
          }
        />
      </ExpandedStorySection>
    )
  }
}

ExpandedStoryReleaseDate.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default ExpandedStoryReleaseDate;
