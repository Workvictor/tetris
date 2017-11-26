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
  background: ${({ isVisible }) => (isVisible ? 'hsla(0, 0%, 0%, 0.5)' : '#000')};
  opacity: ${({ isVisible, pause }) => (isVisible ? 1 : pause ? 1 : 0)};
  z-index: ${({ isVisible, pause }) => (isVisible ? 10 : pause ? 1 : -10)};
  transition: all 100ms ease-out;
  filter: ${({ pause }) => pause ? 'blur(24px) saturate(0)' : 'none'};
`;
