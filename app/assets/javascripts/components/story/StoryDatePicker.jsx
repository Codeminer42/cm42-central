import React, { Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class StoryDatePicker extends React.Component {
  constructor (props) {
    super(props)
    moment.locale(I18n.locale);
    const releaseDate = moment(this.props.releaseDate, ["YYYY-MM-DD"])
    this.state = {
      startDate: releaseDate.isValid() ? releaseDate : null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    }, () => this.props.onChangeCallback()
    );
  }

  render() {
    return (
      <Fragment>
        <label htmlFor="release-date">{I18n.t('activerecord.attributes.story.release_date')}</label>
        <br/>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleChange}
          className="release_date form-control input-sm"
          name="release_date"
          placeholderText={I18n.t('activerecord.attributes.story.release_date')}
        />
      </Fragment>
    );
  }
}
