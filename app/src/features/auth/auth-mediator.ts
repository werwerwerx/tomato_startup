"use client";
import { ApiResponse } from "@/shared/types";
import { BrowserEventEmitter } from "@/shared/lib/event-emitter";
import { useState, useEffect } from "react";
import z from "zod";

export type AuthStrategy = "LOGIN" | "REGISTER" | "LOGIN-VERIFY" | "REGISTER-VERIFY";
type EventPayload = {
  email_change: [email: string];
  email_submitted: [];
  email_submitted_success: [];
  validation_success: [boolean];
  code_submitted: [code: string];
  auth_strategy_changed: [AuthStrategy];
  error: [string | null];
  message: [string | null];
  code_submitted_success: [];
  code_change: [code: string];
};

// public only for user actions, all logic is incapsulated under public api
// its simple we just pull some changeEmail actions or submitEmail actions or toggleAuthStrategy actions. and all logic is inside we dont give a shit about it we cant see this low level logic in our components. and we keep it simple and testing, debugging we see the data flow, okay ? so simple.

export interface AuthFormMediator {
  changeEmailAction(email: string): void;
  submitEmailAction(): void;
  toggleAuthStrategyAction(): void;
  submitCodeAction(code: string): void;
  changeCodeAction(code: string): void;

  // no one methods not saying about we changing ui of the form. we just saying this shit is now different bitch, do somthing with your behavior
  useError(): string | null;
  useValidatonSuccess(): boolean;
  useMessage(): string | null;
  useAuthStrategy(): AuthStrategy;
  useIsLoading(): boolean;
  useIsEmailSubmitSuccess(): boolean;
  useIsCodeSubmitSuccess(): boolean;
  useCodeChange(): string;

  getEmail(): string;
}

export type AuthApiClient = {
  "LOGIN": (email: string) => Promise<ApiResponse<string, string>>;
  "REGISTER": (email: string) => Promise<ApiResponse<string, string>>;
  "LOGIN-VERIFY": (code: string) => Promise<ApiResponse<string, string>>;
  "REGISTER-VERIFY": (code: string) => Promise<ApiResponse<string, string>>;
}

export class AuthFormMediator implements AuthFormMediator {
  private eventEmmiter: BrowserEventEmitter<EventPayload>;
  formStrategy: AuthStrategy = "REGISTER";
  email: string = "";
  isEmailSuccessfullySubmitted: boolean = false;
  isCodeSuccessfullySubmitted: boolean = false;
  api: AuthApiClient;

  constructor(api: AuthApiClient) {
    this.api = api;
    this.eventEmmiter = new BrowserEventEmitter();
  }

  useAuthStrategy = () => {
    const [strategy, setStrategy] = useState<AuthStrategy>(this.formStrategy);
    useEffect(() => {
      this.eventEmmiter.on("auth_strategy_changed", (strategy) => {
        setStrategy(strategy);
      });
    }, []);
    return strategy;
  }

  toggleAuthStrategyAction = () => {
    const newStrategy = this.formStrategy === "LOGIN" ? "REGISTER" : "LOGIN";
    this.formStrategy = newStrategy;
    this.eventEmmiter.emit("auth_strategy_changed", this.formStrategy);
  }

  changeEmailAction = (email: string) => {
    this.email = email;
    this.eventEmmiter.emit("email_change", email);
    this.validateEmail(email);
  }

  useValidatonSuccess = () => {
    const [validationSuccess, setValidationSuccess] = useState(false);
    useEffect(() => {
      this.eventEmmiter.on("validation_success", (success) => {
        setValidationSuccess(success);
      });
    }, []);
    return validationSuccess;
  }

  useIsEmailSubmitSuccess = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
      this.eventEmmiter.on("email_submitted_success", () => {
        setIsSuccess(true);
      });
    }, []);
    return isSuccess;
  }

  submitEmailAction = () => {
    if (this.formStrategy === "LOGIN-VERIFY" || this.formStrategy === "REGISTER-VERIFY") {
      throw new Error("Email already submitted, error inside application");
    }
    
    this.eventEmmiter.emit("error", null);
    this.eventEmmiter.emit("message", null);
    this.isEmailSuccessfullySubmitted = false;
    
    this.eventEmmiter.emit("email_submitted");
    
    this.api[this.formStrategy](this.email).then((result: ApiResponse<string, string>) => {
      if (result.error) {
        this.eventEmmiter.emit("error", result.error);
        this.isEmailSuccessfullySubmitted = false;
        this.eventEmmiter.emit("email_submitted_success");
        return;
      }
      
      if (result.message) {
        this.isEmailSuccessfullySubmitted = true;
        this.eventEmmiter.emit("message", result.message);
        
        const newStrategy = this.formStrategy === "LOGIN" ? "LOGIN-VERIFY" : "REGISTER-VERIFY";
        this.formStrategy = newStrategy;
        this.eventEmmiter.emit("auth_strategy_changed", newStrategy);
        
        this.eventEmmiter.emit("email_submitted_success");
      }
    }).catch((error) => {
      console.error("API call error:", error);
      this.eventEmmiter.emit("error", "Произошла ошибка при отправке запроса");
      this.isEmailSuccessfullySubmitted = false;
      this.eventEmmiter.emit("email_submitted_success");
    });
  }

  submitCodeAction = (code: string) => {
    
    // Clear previous errors/messages
    this.eventEmmiter.emit("error", null);
    this.eventEmmiter.emit("message", null);
    
    // Start loading
    this.eventEmmiter.emit("code_submitted", code);
    
    console.log("Submitting code:", code, "Strategy:", this.formStrategy);
    
    this.api[this.formStrategy](code)
      .then((result: ApiResponse<string, string>) => {
        console.log("Code submission result:", result);
        if (result.error) {
          this.eventEmmiter.emit("error", result.error);
          this.isCodeSuccessfullySubmitted = false;
          this.eventEmmiter.emit("code_submitted_success");
          return;
        }
        
        if (result.message) {
          this.isCodeSuccessfullySubmitted = true;
          this.eventEmmiter.emit("message", result.message);
          this.eventEmmiter.emit("code_submitted_success");
        }
      })
      .catch((error) => {
        console.error("Code submission error:", error);
        this.eventEmmiter.emit("error", "Произошла ошибка при отправке кода");
        this.isCodeSuccessfullySubmitted = false;
        this.eventEmmiter.emit("code_submitted_success");
      });
  }

  useIsCodeSubmitSuccess = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    useEffect(() => {
      this.eventEmmiter.on("code_submitted_success", () => {
        setIsSuccess(true);
      });
    }, []);
    return isSuccess;
  }

  changeCodeAction = (code: string) => {
    if (code.length === 6) {
      this.submitCodeAction(code);
    }
    this.eventEmmiter.emit("code_change", code);
  }

  useError = () => {
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      this.eventEmmiter.on("error", (error) => {
        setError(error);
      });
    }, []);
    return error;
  }

  useMessage = () => {
    const [message, setMessage] = useState<string | null>(null);
    useEffect(() => {
      this.eventEmmiter.on("message", (message) => {
        setMessage(message);
      });
    }, []);
    return message;
  }

  getEmail = () => {
    if(this.formStrategy === "LOGIN-VERIFY" || this.formStrategy === "REGISTER-VERIFY") {
      return this.email;
    }
    return "";
  }

  validateEmail = (email: string) => {
    try {
      const emailSchema = z.string().email().min(3);
      const result = emailSchema.safeParse(email);

      if (!result.success || email === "") {
        this.eventEmmiter.emit("validation_success", false);
        this.eventEmmiter.emit("error", "Некорректный email");
        return false;
      }

      this.eventEmmiter.emit("validation_success", true);
      this.eventEmmiter.emit("error", null);
      return true;
    } catch (error) {
      console.error("Email validation error:", error);
      this.eventEmmiter.emit("validation_success", false);
      this.eventEmmiter.emit("error", "Ошибка валидации email");
      return false;
    }
  }

  useIsLoading = () => {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      this.eventEmmiter.on("email_submitted", () => {
        setIsLoading(true);
      });
      this.eventEmmiter.on("email_submitted_success", () => {
        setIsLoading(false);
      });
      this.eventEmmiter.on("code_submitted", () => {
        setIsLoading(true);
      });
      this.eventEmmiter.on("code_submitted_success", () => {
        setIsLoading(false);
      });
      this.eventEmmiter.on("error", () => {
        setIsLoading(false);
      });
    }, []);
    return isLoading;
  }

  useCodeChange = () => {
    const [code, setCode] = useState("");
    useEffect(() => {
      this.eventEmmiter.on("code_change", (code) => {
        setCode(code);
      });
    }, []);
    return code;
  }
}
