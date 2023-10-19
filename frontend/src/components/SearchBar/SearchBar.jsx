import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';



const SearchBar = ({ values, setValues }) => {

    const [searchText, setSearchText] = useState('');

    const { data } = useSelector(state => state.jobs)
    const HandleSearch = () => {
        const filteredData = values.filter((value) => {
            return searchText.toLowerCase() === ''
                ? value
                : (
                    value.company_name.toLowerCase().includes(searchText) ||
                    value.designation.toLowerCase().includes(searchText) ||
                    value.description.toLowerCase().includes(searchText)
                )
        })
        if (filteredData.length > 0) {
            setValues(filteredData);
        } else {
            setValues(null)
        }
    }
    useEffect(() => {
        if (!searchText) {
            setValues(data)
        }
    }, [searchText])
    return (
        <div className="container-fluid bg-primary mb-5 wow fadeIn" data-wow-delay="0.1s" style={{ padding: '35px' }}>
            <div className="container">
                <div className="row g-2">
                    <div className="col-md-10">
                        <div className="row g-2">
                            <div className="col-md-10">
                                <input type="text" className="form-control border-0" onChange={e => setSearchText(e.target.value)} placeholder="Keyword" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-dark border-0 w-100" onClick={HandleSearch}>Search</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBar
