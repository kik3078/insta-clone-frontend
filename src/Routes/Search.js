import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import FatText from "../Components/FatText";

const Wrapper = styled.div`
    height: 50vh;
    text-align: center;
`;

export default withRouter(({ location: { search } }) => {
    const searchTerm = search.split("=")[1];
    return (
        <Wrapper>
            {searchTerm === undefined && <FatText text={"Search for something"} />}
        </Wrapper>
    );
})