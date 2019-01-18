import React from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';

class AttachmentsList extends React.Component {
  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(fileId) {
    const { files, onDelete } = this.props;

    onDelete(
      files.filter(file => file.id !== fileId)
    )
  }

  render() {
    const { files, cloudName } = this.props

    return (
      <div>
        {
          files.map(file => {
            const link = `http://res.cloudinary.com/${cloudName}/${file.resourceType}/upload/${file.path}`

            return <Attachment
              id={file.id}
              key={file.publicId}
              link={link}
              publicId={file.publicId}
              type={file.resourceType}
            >
              <button onClick={() => this.handleDelete(file.id)} className="btn btn-danger btn-xs">
                <i className="mi md-18">delete</i>
                {I18n.t('delete')}
              </button>
            </Attachment>
          })
        }
      </div>
    );
  }
}

AttachmentsList.PropTypes = {
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  cloudName: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default AttachmentsList;

