import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const StoryDatePicker = ({ releaseDate, onChangeCallback }) => {
  moment.locale(I18n.locale);
  const initialDate = moment(releaseDate, ['YYYY-MM-DD']);
  const [startDate, setStartDate] = useState(
    initialDate.isValid() ? initialDate : null
  );

  const handleChange = date => {
    setStartDate(date);
    onChangeCallback();
  };

  return (
    <>
      <label htmlFor="release-date">
        {I18n.t('activerecord.attributes.story.release_date')}
      </label>
      <br />
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        className="release_date form-control input-sm"
        name="release_date"
        placeholderText={I18n.t('activerecord.attributes.story.release_date')}
      />
    </>
  );
};

export default StoryDatePicker;
