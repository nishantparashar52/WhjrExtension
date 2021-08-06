import React, { PureComponent } from 'react';
import './SearchBar.scss';

class SearchBar extends PureComponent {

    constructor(props) {
        super(props);
        this.focusedData = {};
        this.modifiedSearchResult = [];
        this.state = {
            showTrending: false,
            showSearchResult: false,
            searchInputValue: ''
        };
    }

    componentDidMount() {
    }

    getSearchResult(context, searchValue, searchData) {
        setTimeout(() => {
            if (searchValue.length) {
                const input = searchValue;
                const redirectPath = `/search?q=${input}`;
                const noOfProducts = searchData && searchData.numberOfProducts;
                window.dtm.LenskartRewamp.searchpage.click.searchSuggestion(input, noOfProducts);
                _gaq.push(['_trackEvent', 'Header', 'search', `page: ${document.location.href}${document.location.href}`], ['ninja._trackEvent', 'Header', 'search', `page: ${document.location.href}${document.location.href}`]);
                context.setState({ showTrending: false, showSearchResult: false });
                context.props.history.push(redirectPath);
            }
        }, 300);
    }

    escapeHtml(e) {
        const s = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return e.replace(/[&<>"']/g, e => {
            return s[e];
        });
    }

    searchBarEventHandler(eventType, event) {
        const { headerActions } = this.props;
        switch (eventType) {
            case 'keyup':
                if (event.target.value.length === 0) {
                    this.setState({ showTrending: true, showSearchResult: false, searchInputValue: event.target.value.trim() });
                } else if (event.target.value.length > 0 && event.target.value !== this.state.searchInputValue && !Object.keys(this.focusedData).length) {
                    this.setState({ showTrending: false, showSearchResult: true, searchInputValue: event.target.value.trim() });
                    headerActions.searchInputChange(event.target.value);
                }
                break;
            case 'keydown':
                if (event.which === 38) {
                    if (this.focusedData.uniqueId) {
                        const currentIndex = this.modifiedSearchResult.findIndex(data => data.uniqueId === this.focusedData.uniqueId);
                        const nextSelection = this.modifiedSearchResult[currentIndex - 1] || this.modifiedSearchResult[0];
                        document.getElementById(this.modifiedSearchResult[currentIndex].uniqueId).classList.remove('hover');
                        document.getElementById(nextSelection.uniqueId).classList.add('hover');
                        this.focusedData = nextSelection;
                    } else {
                        this.focusedData = this.modifiedSearchResult[0];
                        document.getElementById(this.focusedData.uniqueId).classList.add('hover');
                    }
                    event.target.value = this.focusedData.autosuggest;
                }
                if (event.which === 40) {
                    if (this.focusedData.uniqueId) {
                        const currentIndex = this.modifiedSearchResult.findIndex(data => data.uniqueId === this.focusedData.uniqueId);
                        const nextSelection = this.modifiedSearchResult[currentIndex + 1] || this.modifiedSearchResult[0];
                        document.getElementById(this.modifiedSearchResult[currentIndex].uniqueId).classList.remove('hover');
                        document.getElementById(nextSelection.uniqueId).classList.add('hover');
                        this.focusedData = nextSelection;
                    } else {
                        this.focusedData = this.modifiedSearchResult[0];
                        document.getElementById(this.focusedData.uniqueId).classList.add('hover');
                    }
                    event.target.value = this.focusedData.autosuggest;
                }
                if (event.which === 13) {
                    event.preventDefault();
                    const input = event.target.value.trim();
                    window.dtm.LenskartRewamp.searchpage.click.searchSuggestion(input);
                    this.focusedData = {};
                    this.getSearchResult(this, input, '');
                }
                if (event.which === 220) {
                    event.preventDefault();
                }
                break;
            case 'focus':
                setTimeout(() => {
                    this.setState({ showTrending: true, showSearchResult: false });
                    this.focusedData = {};
                }, 200);
                break;
            case 'blur':
                setTimeout(() => {
                    this.setState({ showTrending: false, showSearchResult: false });
                    this.focusedData = {};
                }, 200);
                break;

            default:
                break;
        }
    }
    boldData(searchData, data) {
        const searchDataValue = searchData && searchData.searchMetaData && searchData.searchMetaData.queryParams.q;
        const searchValue = new RegExp(searchDataValue, 'i');
        return data.replace(searchValue, `<span class="menu-list">${searchDataValue}</span>`);

    }

    render() {
        const trendingSearch = [{ name: 'Ray ban', url: 'https://www.lenskart.com/sunglasses/brands/ray-ban-sunglasses.html' }, { name: 'Eyeglasses', url: 'https://www.lenskart.com/eyeglasses.html' }, { name: 'Sunglasses', url: 'https://www.lenskart.com/sunglasses.html' }, { name: 'Contact Lenses', url: 'https://www.lenskart.com/contact-lenses.html' }, { name: 'Acuvue', url: 'https://www.lenskart.com/contact-lenses/most-popular-contact-lenses/acuvue-contact-lenses.html' }, { name: 'Eyewear Accessories', url: 'https://www.lenskart.com/eyewear-accessories.html' }, { name: 'Oakley', url: 'https://www.lenskart.com/sunglasses/brands/oakley-sunglasses.html' }, { name: 'Mens Sunglasses', url: 'https://www.lenskart.com/sunglasses/find-eyewear/mens-sunglasses.html' }, { name: 'Women Sunglasses', url: 'https://www.lenskart.com/sunglasses/find-eyewear/womens-sunglasses.html' }, { name: 'Aviator', url: 'https://www.lenskart.com/sunglasses/frame-shape/aviator-sunglasses.html' }, { name: 'Purevision', url: 'https://www.lenskart.com/contact-lenses/most-popular-contact-lenses/purevision-contact-lenses.html' }, { name: 'Sunpocket - Folding Sunglasses', url: 'https://www.lenskart.com/sunglasses/brands/sunpocket.html' }, { name: 'Eye Checkup', url: 'https://www.lenskart.com/HTO/' }];
        const { searchData } = this.props;
        const { showTrending, showSearchResult } = this.state;
        const popularProducts = [];
        const infields = [];
        const topQueries = [];
        const keywordSuggestions = [];
        if (searchData) {
            searchData.response.products.forEach(data => {
                switch (data.doctype) {
                    case 'TOP_SEARCH_QUERIES':
                        topQueries.push(data);
                        break;
                    case 'IN_FIELD':
                        infields.push(data);
                        break;
                    case 'POPULAR_PRODUCTS':
                        popularProducts.push(data);
                        break;
                    case 'KEYWORD_SUGGESTION':
                        keywordSuggestions.push(data);
                        break;
                    default:
                        break;
                }
            });
        }
        const matchingLength = keywordSuggestions.length + topQueries.length > 0 || false;
        this.modifiedSearchResult = [].concat(infields, keywordSuggestions, topQueries, popularProducts);
        return (
            <div className="search">
                <div className="search_toggle-menu">
                    <div className="search_block">
                        <form>
                            <div>
                                <input
                                    placeholder="What are you looking for ?"
                                    type="text"
                                    autoComplete="off"
                                    className="search_input-bar autoSuggest"
                                    name="q"
                                    onKeyDown={event => { this.searchBarEventHandler('keydown', event); }}
                                    onKeyUp={event => { this.searchBarEventHandler('keyup', event); }}
                                    onBlur={event => { this.searchBarEventHandler('blur', event); }}
                                    onFocus={event => { this.searchBarEventHandler('focus', event); }}
                                />
                                <i className="search-icon" aria-hidden="true" onClick={() => this.getSearchResult(this, this.state.searchInputValue, this.props.searchData && this.props.searchData.response)}></i>
                                {searchData && showSearchResult && <div className={`search-result ${matchingLength ? 'p-10' : ''}`}>
                                    <div className={matchingLength ? 'padding-b15' : ''}>
                                        {matchingLength && <div className="text-uppercase search-text-heading">Matching Keywords</div>}
                                        {
                                            infields.map((data, index) => {
                                                return (<div className="suggestions-list" id={data.uniqueId} key={index} role="presentation" onClick={() => this.getSearchResult(this, data.autosuggest, this.props.searchData && this.props.searchData.response)} dangerouslySetInnerHTML={{ __html: this.boldData(this.props.searchData, data.autosuggest) }}>
                                                </div>);
                                            })
                                        }
                                        {
                                            keywordSuggestions.map((data, index) => {
                                                return (<div className="suggestions-list" key={index} id={data.uniqueId} role="presentation" onClick={() => this.getSearchResult(this, data.autosuggest, this.props.searchData && this.props.searchData.response)} dangerouslySetInnerHTML={{ __html: this.boldData(this.props.searchData, data.autosuggest) }}>
                                                </div>);
                                            })
                                        }
                                        {
                                            topQueries.map((data, index) => {
                                                return (<div className="suggestions-list" role="presentation" id={data.uniqueId} key={index} onClick={() => this.getSearchResult(this, data.autosuggest, this.props.searchData && this.props.searchData.response)} dangerouslySetInnerHTML={{ __html: this.boldData(this.props.searchData, data.autosuggest) }}>
                                                </div>);
                                            })
                                        }
                                    </div>
                                    <div className="">
                                        {popularProducts.length > 0 && <div className="text-uppercase search-text-heading">Product Recommendations</div>}
                                        {
                                            popularProducts.map((data, index) => {
                                                return (<div key={index} className="popular-product-container" id={data.uniqueId}>
                                                    <Link to={{ pathname: data.url_path.substring(data.url_path.indexOf('.com/') + 4), state: { productId: '', section: 'prod' } }}>
                                                        <div className="info">
                                                            <div className="layout">
                                                                <div className="image">
                                                                    <img
                                                                        alt="prod"
                                                                        src={data.small_image && data.small_image.replace('http', 'https')}
                                                                        onError={() => {
                                                                            this.src = 'http://sol-us-prod-1.cloudapp.net/cilory/ina.jpg';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="text">
                                                                    <div className="brand">{data.Brand_fq[0]}</div>
                                                                    <div className="name" dangerouslySetInnerHTML={{ __html: this.boldData(this.props.searchData, data.name) }}></div>
                                                                </div>
                                                            </div>
                                                            <div className="price"><i className="fa fa-rupee"></i>&nbsp;{data.final_price}</div>
                                                        </div>
                                                    </Link>
                                                </div>);
                                            })
                                        }

                                    </div>
                                </div>}
                                {showTrending && <div className="trending">
                                    <div className="trending_block">
                                        <h3>
                                            {' '}
                                            Trending Search
                                            {' '}
                                        </h3>
                                        <ul className="trending_list menu-link">
                                            {
                                                trendingSearch.map((item, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <a href={item.url} dangerouslySetInnerHTML={{ __html: this.boldData(this.props.searchData, item.name) }}>
                                                            </a>
                                                        </li>
                                                    );
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    searchData: state.header.searchData
});

function mapDispatchToProps(dispatch) {
    return {
        headerActions: bindActionCreators(headerActions, dispatch),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
