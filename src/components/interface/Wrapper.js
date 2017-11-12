import styled from 'styled-components';
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  position: fixed;
  flex-direction: column;
  justify-content: center;
  top: 0;
  left: 0;
  color: #fff;
  background: #000;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  z-index: ${({ isVisible }) => (isVisible ? 10 : -10)};
  transition: all 100ms ease-out;
`;
