import React from "react";
import { withRouter } from "react-router-dom";
import SearchPresenter from "./SearchPresenter";
import { useQuery } from "react-apollo-hooks";
import { SEARCH } from "./SearchQueries";

export default withRouter(({ location: { search } }) => {
    const term = search.split("=")[1];
    const { data, loading } = useQuery(SEARCH, {
        skip: term === undefined, // skip 이 true라면 어떠한 쿼리도 실행되지 않음
        variables: {
            term
        }
    });
    return <SearchPresenter searchTerm={term} loading={loading} data={data} />;
});