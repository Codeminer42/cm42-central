import React from 'react';

class Note extends React.Component {
  constructor() {
    super();

    this.renderDelete = this.renderDelete.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  render() {
    const { note, disabled } = this.props;

    return (
      <div className="note">
        <div dangerouslySetInnerHTML={this.parseNote(note)}></div>
        <div className="note_meta">
          <span className="user"> { note.get('user_name') } </span> -
          <span className="created_at"> { note.get('created_at') } </span>
          { !disabled && this.renderDelete() }
        </div>
      </div>
    );
  }

  renderDelete() {
    return (
      <span>
        - <a
            href="#"
            onClick={this._handleDelete}
            title={I18n.t('delete')}
            className="delete-note"
          >
          { I18n.t('delete') }
        </a>
      </span>
    );
  }

  parseNote(note) {
    return ({
      __html: window.md.makeHtml(note.escape('note'))
    });
  }

  _handleDelete() {
    const { note, handleDelete } = this.props;
    handleDelete(note);
  }
}

export default Note;
