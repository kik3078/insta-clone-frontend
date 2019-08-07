import React, {useState} from "react";
import AuthPresenter from "./AuthPresenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN, CREATE_ACCOUNT, CONFIRM_SECRET, LOCAL_LOG_IN } from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
    const [action, setAction] = useState("logIn");
    const username = useInput("");
    const firstName = useInput("");
    const lastName = useInput("");
    const secret = useInput("");
    const email = useInput("");

    const [requestSecretMutation] = useMutation(LOG_IN, {
        variables: { email: email.value }
    });

    const [createAccountMutation] = useMutation(CREATE_ACCOUNT, {
        variables: {
            email: email.value,
            username: username.value,
            firstName: firstName.value,
            lastName: lastName.value
        }
    });

    const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
        variables: {
            email: email.value,
            secret: secret.value
        }
    })

    const [localLogInMutation] = useMutation(LOCAL_LOG_IN);

    const onSubmit = async e => {
        e.preventDefault();
        if (action === "logIn") {
            if (email.value !== "") {
                try {
                    const { data: { requestSecret } } = await requestSecretMutation();
                    if (!requestSecret) {
                        toast.error("계정이 없습니다. 먼저 회원가입을 하세요.");
                        setTimeout(() => {
                            setAction("signUp");
                        }, 3000);
                    } else {
                        toast.success("보안 코드가 전송되었습니다! 보안 코드를 이용하여 로그인 해 주세요.");
                        setAction("confirm");
                    }
                } catch {
                    toast.error("보안 코드를 요청할 수 없습니다. 다시 시도해 주세요.");
                }
            } else {
                toast.error("이메일이 필요합니다.")
            }
        } else if (action === "signUp") {
            if (email.value !== "" &&
                username.value !== "" &&
                firstName.value !== "" &&
                lastName.valu !== ""
                )   {
                    try {
                        const { data: { createAccount } } = await createAccountMutation();
                        if (!createAccount) {
                            toast.error("계정을 만들 수 없습니다.");
                        } else {
                            toast.success("계정이 생성되었습니다.");
                            setTimeout(() => setAction("logIn"), 3000);
                        }
                    } catch (e) {
                        toast.error(e.message);
                    }
            } else {
                toast.error("모든 내용을 채워주세요.")
            }
        } else if (action === "confirm") {
            if (secret.value !== "") {
                try {
                    const { data : { confirmSecret:token } } = await confirmSecretMutation();
                    if (token !== "" && token !== undefined) {
                        localLogInMutation({ variables: { token } });
                    } else {
                        throw Error();
                    }
                } catch {
                    toast.error("보안 코드가 틀렸습니다. 다시 확인해 주세요.");
                }
            }
        }
    };

    return (
        <AuthPresenter 
            setAction={setAction}
            action={action}
            username={username}
            firstName={firstName}
            lastName={lastName}
            email={email}
            secret={secret}
            onSubmit={onSubmit}
        />
    )
};