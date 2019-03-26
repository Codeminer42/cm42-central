import React from 'react';
import ExpandedStorySection from '../ExpandedStorySection';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { editingStoryPropTypesShape } from '../../../../models/beta/story';

const ExpandedStoryReleaseDate = ({ onEdit, story }) => {
  const releaseDate = moment(story._editing.releaseDate, ["YYYY-MM-DD"]);
  const validReleaseDate = releaseDate.isValid() ? releaseDate : null;

  return (
    <ExpandedStorySection
      title={I18n.t('activerecord.attributes.story.release_date')}
    >
      <DatePicker
        placeholderText={
          I18n.t('activerecord.attributes.story.release_date')
        }
        selected={validReleaseDate}
        className="form-control input-sm"
        onChange={(releaseDate) =>
          onEdit(releaseDate.format())
        }
      />
    </ExpandedStorySection>
  )
};

ExpandedStoryReleaseDate.propTypes = {
  story: editingStoryPropTypesShape.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default ExpandedStoryReleaseDate;
