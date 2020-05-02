import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

class CandidateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: [],
            applications: [],
            filteredCandidates: [],
            comments: [],
        }
    }

    // Select onChange
    handleChange = (prop, value) => {
        const newState = Object.assign({}, this.state, { [prop]: value });
        this.setState(newState);
        this.getCandidateDetails(value);
    }

    // Comment Change
    commentChange = (id, value) => {
        const { filteredCandidates } = this.state;
        _.chain(filteredCandidates).get('videos', []).find(item => item.questionId === +id).set('comments', value).value();
        this.setState(filteredCandidates)
    }

    // Filter Candidate Details
    getCandidateDetails(id) {
        const { applications } = this.state;
        const filteredCandidates = _.find(applications, item => item.id == +id);
        this.setState({ filteredCandidates })
    }

    // Submit Comments
    handleSubmit = (e, id) => {
        e.preventDefault();
        _.find(this.state.filteredCandidates.videos, (item) => item.questionId === id ?
            axios.post(`http://localhost:8080/comments/${id}`, item.comments)
                .then(res => console.log(res))
                .catch(err => console.log(err))
            : 'null'
        )
        return false;
    }

    // Get list
    getList() {
        axios.all([
            axios.get('http://localhost:8080/candidates'),
            axios.get('http://localhost:8080/applications')
        ])
            .then(res => {

                const candidates = _.get(res, [0, 'data'], []);
                const applications = _.get(res, [1, 'data'], []);

                this.setState({
                    candidates,
                    applications
                })
            })
            .catch(err => console.log(err))
    }


    componentDidMount() {
        this.getList();
    }


    render() {
        const { candidates, filteredCandidates } = this.state;
        const videos = _.get(filteredCandidates, 'videos', []);
        return (
            <div>
                <h1>Knockri Assessment</h1>
                <div>
                    <select onChange={(e) => { this.handleChange('candidate', e.target.value) }}>
                        <option value="">Candidates</option>
                        {_.map(candidates, data => (
                            <option key={data.id} value={data.applicationId}>
                                {data.name}
                            </option>
                        ))}
                    </select>
                </div>
                <br />
                <br />
                <div>
                    <div>
                        {videos.length === 0? (
                            <h1>No Interview Video's avaialable</h1>
                        ): (
                            _.map(videos, val => (
                                <div key={val.questionId}>
                                    <video 
                                        style={{ margin: '5px' }} 
                                        width="320" height="240" 
                                        controls 
                                        src={val.src} 
                                        type="video/mp4">
                                    </video>
                                    <form onSubmit={(e) => (this.handleSubmit.call(this, e, val.questionId))}>
                                        <input
                                            placeholder="Type Comments"
                                            type="text"
                                            onChange={(e) => { this.commentChange(val.questionId, e.target.value) }}
                                        />
                                        <button className="btn btn-primary" style={{ margin: '5px' }} type="submit">
                                            Save
                                            </button>
                                    </form>
                                </div>
                        ))
                        )}
                        
                    </div>
                </div>
            </div >
        );
    }
}

export default CandidateList;