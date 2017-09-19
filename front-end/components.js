// Define React Component
class File extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="file-name">
                <span className="label-name">{this.props.file.name}</span>
                <a href={this.props.file.url} className="link" target="_blank" download>Download</a>
            </div>
        )
    }
}

class FilesList extends React.Component {

    constructor() {
        super();

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        $.ajax({
            url: this.props.API_URL,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.API_URL, status, err.toString());
            }.bind(this)
        });
    }

    handleFile(e) {
        e.preventDefault();

        var formData = new FormData($('form')[0]),
            isFileExist = !!$('input[type=file]')[0].files[0];

        if (isFileExist) {
            $.ajax({
                url: this.props.API_URL + 'upload_file',
                type: 'POST',
                data: formData,
                xhr: function () {
                    var xhr = new window.XMLHttpRequest();

                    xhr.upload.addEventListener("progress", function (e) {
                        if (e.lengthComputable) {
                            $('progress').attr({value: e.loaded, max: e.total});
                            $('#status').empty().text(parseInt((e.loaded / e.total * 100)) + '%');
                        }
                    }, false);

                    return xhr;
                }.bind(this),
                success: function (data) {
                    this.setState({
                        data: JSON.parse(data)
                    });
                    $('#status').empty().text('Successfully loaded!');
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.API_URL, status, err.toString());
                }.bind(this),
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            $('#status').empty().text('Please choose the file.');
        }
    }

    render() {
        var self = this,
            data = this.state.data,
            showListOfFiles = data.length > 0 ? '' : 'you have no any files yet..',
            files = data.map(function(file, index) {
                return (<File key={index} file={file}/>);
            });

        return (
            <div>
                <div className="title">Available Files</div>
                <div>{showListOfFiles}</div>
                <div>{files}</div>
                <form id="uploadForm" className="form-padded" encType="multipart/form-data" onSubmit={this.handleFile.bind(this)}>
                    <input type="file" name="userFile"/>
                    <input type="submit" value="Upload File" name="submit"/>
                </form>
                <progress></progress>
                <span id="status" className="status-percentage"></span>
            </div>
        );
    }
}

class App extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <FilesList {...this.props} API_URL={API_URL}/>
            </div>
        )
    }
}

var API_URL = 'http://localhost:3000/';
var container = document.getElementById('container');
ReactDOM.render(<App/>, container);